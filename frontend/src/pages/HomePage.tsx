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
  "https://images.unsplash.com/photo-1758874573757-bbf1ef6d1bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRwbGFjZSUyMHNob3BwaW5nJTIwb25saW5lJTIwaGVyb3xlbnwxfHx8fDE3NzcwNzU2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { isLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    (async () => {
      try {
        const products = await listAllProducts();
        dispatch(fetchProductsSuccess(products));
        const favoriteIds = await fetchFavorites();
        dispatch(toggleFavoriteInStore(favoriteIds));

      } catch (e) {
        console.error("Falha ao carregar produtos:", e);
      }
    })();
  }, [dispatch]);

  const allProducts = useSelector((state: RootState) => state.products.products);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 drop-shadow">
              Compre e Venda com{" "}
              <span className="text-yellow-300">Facilidade</span>
            </h1>
            <p className="text-orange-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Milhares de produtos à sua disposição. Encontre as melhores ofertas
              ou anuncie o que você não usa mais.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-3.5 outline-none text-gray-800 text-sm placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["iPhone", "Samsung", "MacBook", "RTX 4070", "Logitech", "Monitor"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/produtos?q=${tag}`)}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded-full transition-colors backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Compra Segura", desc: "Pagamento protegido" },
              { icon: Truck, label: "Entrega Rápida", desc: "Frete para todo Brasil" },
              { icon: Star, label: "Avaliações Reais", desc: "Vendedores verificados" },
              { icon: Zap, label: "Ofertas Diárias", desc: "Descontos exclusivos" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-medium">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — links de busca por nome sem depender de campo category na API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Categorias</h2>
          <Link
            to="/produtos"
            className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Celulares", icon: "📱", q: "celular" },
            { label: "Notebooks", icon: "💻", q: "notebook" },
            { label: "Computadores", icon: "🖥️", q: "pc" },
            { label: "Teclados", icon: "⌨️", q: "teclado" },
            { label: "Mouses", icon: "🖱️", q: "mouse" },
            { label: "Monitores", icon: "🖥️", q: "monitor" },
          ].map(({ label, icon, q }) => (
            <Link
              key={label}
              to={`/produtos?q=${encodeURIComponent(q)}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-gray-700 text-xs text-center group-hover:text-orange-500 transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Destaques</h2>
          <Link
            to="/produtos"
            className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
            </div>
          ) : (
            allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-white mb-3">Tem algo para vender?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
            Anuncie seus produtos gratuitamente e alcance milhares de compradores em todo o Brasil.
          </p>
          <Link
            to="/vender"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
          >
            Anunciar Agora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}