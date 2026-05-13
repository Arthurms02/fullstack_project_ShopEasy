import { Link, useNavigate } from "react-router";
import { Search, ArrowRight, Shield, Truck, Star, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../app/store";
import { useEffect } from "react";
import { listAllProducts, fetchFavorites } from "../features/product/productAPI";
import { fetchProductsSuccess } from "../features/product/productSlice";
import { toggleFavoriteInStore } from "../features/product/favoriteSlice";




const heroImage =
  "https://fastly.picsum.photos/id/348/3872/2592.jpg?hmac=I51bqSjuTk6zKHgtJDpMLY3kSSfAXdB8AHGmWf-Eq1Q";


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selecionando apenas o necessário do estado
  const { products, isLoading } = useSelector((state: RootState) => state.products);


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega produtos iniciais 
        const data = await listAllProducts();
        dispatch(fetchProductsSuccess(data));
        
        // Carrega favoritos do usuário
        const favoriteIds = await fetchFavorites();
        dispatch(toggleFavoriteInStore(favoriteIds));
      } catch (e) {
        console.error("Erro ao carregar dados iniciais:", e);
      }
    };

    loadInitialData();
  }, [dispatch]); // Dependência limpa

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // A Home apenas envia o usuário para a listagem com o parâmetro na URL
      navigate(`/produtos?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-500 hover:opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Compre e Venda com <span className="text-yellow-300">Facilidade</span>
            </h1>
            <p className="text-orange-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Milhares de produtos à sua disposição. Encontre as melhores ofertas
              ou anuncie o que você não usa mais.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl focus-within:ring-4 focus-within:ring-orange-300 transition-all"
            >
              <input
                type="text"
                placeholder="O que você está procurando hoje?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 outline-none text-gray-800 text-lg"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-8 py-4 text-white font-bold transition-colors flex items-center gap-2"
              >
                <Search className="w-6 h-6" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </form>
            
            {/* Tags sugeridas */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["iPhone", "MacBook", "RTX 4070", "Monitor"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/produtos?q=${tag}`)}
                  className="bg-white/10 hover:bg-white/25 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-all backdrop-blur-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Adicionado Hover Effects */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: "Compra Segura", desc: "100% Protegido" },
              { icon: Truck, label: "Entrega Rápida", desc: "Todo o Brasil" },
              { icon: Star, label: "Vendedores Pro", desc: "Verificados" },
              { icon: Zap, label: "Ofertas Flash", desc: "Novidades diárias" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-orange-500">
                  <Icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Produtos com Verificação de Vazio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Destaques da Semana</h2>
            <p className="text-gray-500 mt-2">Os produtos mais desejados do momento</p>
          </div>
          <Link
            to="/produtos"
            className="group text-orange-500 font-semibold flex items-center gap-2 hover:underline"
          >
            Ver catálogo completo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Buscando as melhores ofertas...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-100 rounded-3xl">
            <p className="text-gray-500">Nenhum produto em destaque no momento.</p>
          </div>
        )}
      </section>

      {/* Banner de Venda - Melhorado visualmente */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-[2rem] p-10 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ganhe dinheiro desapegando!</h2>
                <p className="text-gray-400 text-lg mb-10">
                    Anuncie em menos de 2 minutos e alcance compradores em todo o país. É grátis e seguro.
                </p>
                <Link
                    to="/vender"
                    className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl transition-all font-bold text-lg hover:scale-105 shadow-xl shadow-orange-500/20"
                >
                    Começar a Vender
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}