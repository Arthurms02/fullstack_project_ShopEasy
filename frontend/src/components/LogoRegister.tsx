import { Store } from "lucide-react";


export default function LogoRegister() {
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-gray-900 text-center">Criar conta</h1>
            <p className="text-gray-500 text-sm mt-1">É grátis e rápido!</p>
        </div>
    );
}