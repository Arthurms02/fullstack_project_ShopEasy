import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Store, Search, Home, Tag, ShoppingCart, ChevronDown, User, LogOut, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { HeaderProps } from "../types/types";
import api from "../app/api";
import { useQuery } from "@tanstack/react-query";


const schema = yup.object().shape({
    query: yup.string().optional(),
});

type SearchFormData = yup.InferType<typeof schema>;



export default function Header({ onSearch }: HeaderProps) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const isAuthenticated = auth.isAuthenticated ?? false;
    const isSeller = auth.role === "vendedor";
    const totalItems = 0; // Substitua pela lógica real de contagem de itens no carrinho
    const user = isAuthenticated ? {
        name: auth.nome_completo ?? "Usuário",
        email: auth.email ?? "usuário@exemplo.com",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.nome_completo ?? "Usuário")}&background=random&color=fff`,
    } : null;

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [filtro, setFiltro] = useState("");

    const handleLogout = () => {
        setUserMenuOpen(false);
        navigate("/");
        dispatch({ type: "auth/logout" });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormData>({
        resolver: yupResolver<SearchFormData>(schema),
        defaultValues: { query: "" },
    });

    const {data: produtosFiltrados, isLoading, error} = useQuery({
        queryKey: ["produtos", filtro],
        queryFn: async () => {
            if (!filtro) return [];
            const { data } = await api.get(`/api/v1/products/?search=${filtro}`);
            return data;
        },
        enabled: !!filtro, // A query só roda se houver um filtro definido
    });

    console.log("Produtos filtrados:", produtosFiltrados);


    const onSubmit = (data: SearchFormData) => {
        const query = data.query?.trim() || "";
        onSearch(query);
        setFiltro(query); // Passa a string vazia se query for undefined
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-900 font-semibold text-lg hidden sm:block">
                            Mercado<span className="text-orange-500">Livre</span>
                        </span>
                    </Link>
                    {/* Search bar (desktop) */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="hidden md:flex flex-1 max-w-xl mx-6"
                    >
                        <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                {...register("query")}
                                className="flex-1 px-4 py-2 outline-none text-sm bg-white text-gray-900 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive("/")
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            Início
                        </Link>
                        <Link
                            to="/produtos"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive("/produtos")
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Tag className="w-4 h-4" />
                            Produtos
                        </Link>
                        {/* Show Anunciar only for sellers or unauthenticated */}
                        {(!isAuthenticated || isSeller) && (
                            <Link
                                to={isAuthenticated ? "/vender" : "/login"}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                            >
                                <Store className="w-4 h-4" />
                                Anunciar
                            </Link>
                        )}
                        {/* Cart */}
                        <Link
                            to="/carrinho"
                            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </Link>
                        {/* User menu */}
                        {isAuthenticated ? (
                            <>
                                {isSeller && (
                                    <Link
                                        to="/vender"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                    >
                                        <Store className="w-4 h-4" />
                                        Anunciar
                                    </Link>
                                )}
                                {/* Carrinho (Apenas um bloco) */}
                                <Link to="/carrinho" className="relative flex items-center gap-1.5 px-3 py-2 ...">
                                    <ShoppingCart className="w-5 h-5" />
                                    {totalItems > 0 && <span className="..."> {totalItems} </span>}
                                </Link>
                                {/* Menu do Usuário (Seu bloco de avatar) */}
                            </>
                        ) : (
                            <Link to="/login" className="...">
                                <User className="w-4 h-4" />
                                Entrar
                            </Link>
                        )}

                        {/* User menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <img
                                        src={user!.avatar}
                                        alt={user!.name}
                                        className="w-7 h-7 rounded-full bg-gray-200"
                                    />
                                    <span className="text-sm text-gray-700 max-w-[80px] truncate">
                                        {user!.name.split(" ")[0]}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                                            <div className="px-3 py-2.5 border-b border-gray-100">
                                                <p className="text-gray-900 text-sm font-medium truncate">
                                                    {user!.name}
                                                </p>
                                                <p className="text-gray-400 text-xs truncate">{user!.email}</p>
                                                <span
                                                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${isSeller
                                                        ? "bg-orange-100 text-orange-600"
                                                        : "bg-blue-100 text-blue-600"
                                                        }`}
                                                >
                                                    {isSeller ? "Vendedor" : "Comprador"}
                                                </span>
                                            </div>
                                            <Link
                                                to="/minha-conta"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                Minha Conta
                                            </Link>
                                            {isSeller && (
                                                <Link
                                                    to="/vender"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    Novo Anúncio
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sair
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
