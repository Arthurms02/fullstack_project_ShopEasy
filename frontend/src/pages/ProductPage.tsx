import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, X, ChevronDown, Loader2, Package } from "lucide-react";
import  ProductCard  from "../components/ProductCard";
import { useDispatch ,useSelector } from "react-redux";
import { fetchProductsSuccess } from "../features/product/productSlice";
import { listAllProducts } from "../features/product/productAPI";
import type { RootState } from "../app/store";


type SortOption = "relevance" | "price-asc" | "price-desc" | "stock-desc";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      (async () => {
        try {
          const products = await listAllProducts();
          dispatch(fetchProductsSuccess(products));

        } catch (e) {
          console.error("Falha ao carregar produtos:", e);
        }
      })();
    }, [dispatch]);

  const query = searchParams.get("q") || "";

  // ── React Query ────────────────────────────────────────────────────────────
  const { products , isLoading, error } = useSelector((state: RootState) => state.products);


  const filteredProducts = products
    .filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .filter((p) => {
      const price = parseFloat(p.price);
      if (priceRange.min && price < Number(priceRange.min)) return false;
      if (priceRange.max && price > Number(priceRange.max)) return false;
      return true;
    })
    .filter((p) => (onlyInStock ? p.stock > 0 : true))
    .sort((a, b) => {
      const pa = parseFloat(a.price);
      const pb = parseFloat(b.price);
      if (sortBy === "price-asc") return pa - pb;
      if (sortBy === "price-desc") return pb - pa;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      return 0;
    });

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setOnlyInStock(false);
    setSortBy("relevance");
    setSearchParams({});
  };

  const hasFilters =
    priceRange.min || priceRange.max || onlyInStock || query;

  return (

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-gray-900">
              {query ? `Resultados para "${query}"` : "Todos os Produtos"}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isLoading
                ? "Carregando..."
                : `${filteredProducts.length} produto${filteredProducts.length !== 1 ? "s" : ""} encontrado${filteredProducts.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </button>
            )}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="stock-desc">Maior estoque</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } lg:block w-full lg:w-60 flex-shrink-0`}
          >
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="text-gray-900 text-sm mb-4">Filtrar por</h3>

              {/* Price range */}
              <div className="mb-5">
                <p className="text-gray-700 text-xs font-medium uppercase tracking-wide mb-2">
                  Faixa de Preço (R$)
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((p) => ({ ...p, min: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((p) => ({ ...p, max: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Stock filter */}
              <div>
                <p className="text-gray-700 text-xs font-medium uppercase tracking-wide mb-2">
                  Disponibilidade
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={() => setOnlyInStock((v) => !v)}
                    className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-green-500" />
                    Apenas em estoque
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">⚠️</span>
                <p className="text-gray-700 mb-2">Erro ao carregar produtos</p>
                <p className="text-gray-500 text-sm">Tente novamente mais tarde.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-4">🔍</span>
                <h3 className="text-gray-700 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
