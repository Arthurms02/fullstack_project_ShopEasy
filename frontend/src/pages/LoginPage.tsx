import { Link } from "react-router";
import LogoLogin from "../components/LogoLogin";
import LoginForm from "../features/auth/LoginForm";


const LoginPage: React.FC = () => {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {/* Logo */}
                    <LogoLogin />
                    {/* Form */}
                    <LoginForm />
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Não tem conta?{" "}
                        <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                            Cadastre-se grátis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;