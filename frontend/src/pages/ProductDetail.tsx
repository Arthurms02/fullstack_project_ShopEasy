import { useParams, Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  ArrowLeft,
  Shield,
  Truck,
  Heart,
  Share2,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import ProductCard  from "../components/ProductCard";
// import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
//   const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  // ── React Query ────────────────────────────────────────────────────────────
  const {  isLoading, error } = useSelector((state: RootState) => state.products) ;
  const product = id ? useSelector((state: RootState) => state.products.products.find(p => p.id === Number(id))) : null;
  const { products } = useSelector((state: RootState) => state.products);
  console.log("Produtos no estado:", products);

  // Produtos relacionados: outros da lista excluindo o atual
  const related = products
    ? products.filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  // ── States ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!products) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-gray-700 mb-2">Produto não encontrado</h2>
          <Link to="/produtos" className="text-orange-500 hover:underline text-sm">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i++) //addToCart(products);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i++) //addToCart(products);
    navigate("/carrinho");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <span>/</span>
          <Link to="/produtos" className="hover:text-gray-700">Produtos</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setWishlist(!wishlist)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 ${wishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-gray-900 mb-4 text-2xl">{product.name}</h1>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-4">
              {!inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-xs px-3 py-1.5 rounded-full font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Produto indisponível
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1.5 rounded-full font-medium">
                  <Package className="w-3.5 h-3.5" />
                  Últimas {product.stock} unidades
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1.5 rounded-full font-medium">
                  <Package className="w-3.5 h-3.5" />
                  {product.stock} em estoque
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-orange-50 rounded-xl p-4 mb-5">
              <p className="text-orange-600 text-3xl font-semibold">
                R${" "}
                {price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Em até 12x de R${" "}
                {(price / 12).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                sem juros
              </p>
            </div>

            {/* Quantity */}
            {inStock && (
              <div className="flex items-center gap-3 mb-5">
                <p className="text-sm text-gray-700">Quantidade:</p>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-xs">
                  máx. {product.stock} un.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
              >
                Comprar Agora
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 transition-all ${
                  !inStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : added
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Adicionado!" : "Adicionar ao Carrinho"}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 text-xs">Compra garantida</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-xs">Frete para todo Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h2 className="text-gray-900 mb-4">Descrição do Produto</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* API raw */}
          <details className="mt-6 bg-gray-900 rounded-xl p-4">
            <summary className="text-gray-400 text-xs cursor-pointer hover:text-gray-200 select-none">
              📦 Corpo da API (JSON)
            </summary>
            <pre className="text-green-400 text-xs mt-3 overflow-x-auto">
              {JSON.stringify(
                {
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  stock: product.stock,
                  image_url: product.image_url,
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-6">Outros Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
