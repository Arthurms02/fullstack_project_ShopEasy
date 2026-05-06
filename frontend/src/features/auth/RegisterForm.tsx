import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RegisterRequest } from './authAPI';
import { useNavigate } from 'react-router-dom';


// definir a schema de validação usando yup
const registerSchema = yup.object().shape({
    username: yup.string().required('Nome de usuário é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().min(6, 'A senha deve conter no mínimo 6 caracteres').required('Senha é obrigatória'),
    role: yup.string().oneOf(['cliente', 'vendedor'], 'Role deve ser "cliente" ou "vendedor"').required('Role é obrigatória'),
}).required();

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function RegisterForm() {
    const navigate = useNavigate();

    // configurar o react-hook-form com a validação do yup
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await RegisterRequest(data.username, data.email, data.password, data.role);
            navigate('/login');
        } catch (err: any) {
            console.error('Erro ao registrar usuário:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                <input
                    id="username"
                    type="text"
                    {...register('username')}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
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
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    id="role"
                    {...register('role')}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                >
                    <option value="">Selecione uma role</option>
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                Registrar
            </button>
        </form>
    );
}