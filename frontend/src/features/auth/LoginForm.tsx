import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { loginRequest } from './authAPI';
import { type RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';



// definir a schema de validação usando yup
const loginSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().min(6, 'A senha deve conter no mínimo 6 caracteres').required('Senha é obrigatória'),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    // configurar o react-hook-form com a validação do yup
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        dispatch(loginStart());
        try {
            const response = await loginRequest(data.email, data.password);

            if (response.status === 200) {

                const payload = response.data?.user ?? response.data; // busca o objeto user ou usa o response.data diretamente
                dispatch(loginSuccess(payload));
                navigate('/'); // Redireciona para a página inicial após o login bem-sucedido
            } else {
                dispatch(loginFailure("Erro inesperado ao fazer login, verifique suas credenciais e tente novamente."));
                navigate('/login'); // Redireciona de volta para a página de login
            }
        } catch (error: any) {
            // Tratamento seguro da mensagem de erro
            const mensagem = error.response?.data?.detail
                || error.response?.data?.message
                || "Credenciais inválidas";

            dispatch(loginFailure(mensagem));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
                {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
}