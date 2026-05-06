import { Link } from "react-router-dom";
import RegisterForm from "../features/auth/RegisterForm";
import LogoRegister from "../components/LogoRegister";


const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {/* Logo */}
                    <LogoRegister />
                    {/* Form */}
                    <RegisterForm />
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Já tem conta?{" "}
                        <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;