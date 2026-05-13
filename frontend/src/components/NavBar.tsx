import { useState, useEffect, useRef } from "react";
import {
  Store,
  Search,
  Home,
  Tag,
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
  Package,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { logoutRequest } from "../features/auth/authAPI";
import Logo from "./Logo";



export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  const isAuthenticated = auth.isAuthenticated ?? false;
  const isSeller = auth.role === "vendedor" || auth.role === "admin";
  const user = isAuthenticated
    ? {
        name: auth.nome_completo ?? "Usuário",
        email: auth.email ?? "usuario@exemplo.com",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          auth.nome_completo ?? "Usuário"
        )}&background=random&color=fff`,
      }
    : null;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filtro, setFiltro] = useState("");

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    dispatch(logout());
    logoutRequest();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtro.trim()) {
      navigate(`/produtos?q=${encodeURIComponent(filtro)}`);
      setFiltro(""); // Limpa o input
    }
  };

  useEffect(() => {
    // fecha menu mobile quando muda rota
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // fecha mobile menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);


  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />
          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-6"
            role="search"
          >
            <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="flex-1 px-4 py-2 outline-none text-sm bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                Início
              </Link>

              <Link
                to="/produtos"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/produtos") ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Tag className="w-4 h-4" />
                Produtos
              </Link>

              {(!isAuthenticated || isSeller) && (
                <Link
                  to={isAuthenticated ? "/vender" : "/login"}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Anunciar
                </Link>
              )}

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

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <img src={user!.avatar} alt={user!.name} className="w-7 h-7 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-700 max-w-[80px] truncate">{user!.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                        <div className="px-3 py-2.5 border-b border-gray-100">
                          <p className="text-gray-900 text-sm font-medium truncate">{user!.name}</p>
                          <p className="text-gray-400 text-xs truncate">{user!.email}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${isSeller ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                            {isSeller ? "Vendedor" : "Comprador"}
                          </span>
                        </div>
                        <Link to="/minha-conta" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4 text-gray-400" />
                          Minha Conta
                        </Link>
                        {isSeller && (
                          <Link to="/vender" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Package className="w-4 h-4 text-gray-400" />
                            Novo Anúncio
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4" />
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link to="/carrinho" className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileSearchOpen((s) => !s)}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={(e) =>{
                  e.stopPropagation();
                  setMobileMenuOpen((s) => !s)}}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-2 mb-2">
            <form onSubmit={handleSearch} className="px-2">
              <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="flex-1 px-4 py-2 outline-none text-sm bg-white text-gray-900 placeholder-gray-400"
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                <Home className="w-4 h-4" /> Início
              </Link>
              <Link to="/produtos" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                <Tag className="w-4 h-4" /> Produtos
              </Link>
              {(!isAuthenticated || isSeller) && (
                <Link to={isAuthenticated ? "/vender" : "/login"} className="flex items-center gap-2 px-2 py-2 rounded bg-orange-500 text-white hover:bg-orange-600" onClick={() => setMobileMenuOpen(false)}>
                  <Store className="w-4 h-4" /> Anunciar
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link to="/minha-conta" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4" /> Minha Conta
                  </Link>
                  {isSeller && (
                    <Link to="/vender" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                      <Package className="w-4 h-4" /> Novo Anúncio
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-2 py-2 rounded text-red-500 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4" /> Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}