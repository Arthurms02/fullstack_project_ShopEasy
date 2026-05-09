import { Link } from "react-router";
import { Star, MapPin, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { ProductCardProps } from "../features/product/productType";
import { addToCart } from "../features/cart/cartSlice";
import { addToCartApi } from "../features/cart/cartAPI";




export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adicionando ao carrinho:", product);
    dispatch(addToCart(product));
    try{
      const response = await addToCartApi(product);
      console.log("Resposta da API:", response);

    }catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };


  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(!wishlist);
  };

  const conditionColor = {
    Novo: "bg-green-100 text-green-700",
    Seminovo: "bg-blue-100 text-blue-700",
    Usado: "bg-gray-100 text-gray-600",
  }[product.condition];

  return (
    <Link to={`/produtos/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              -{discount}%
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${wishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
          <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor}`}>
            {product.condition}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-gray-500 text-xs mb-1">{product.category}</p>
          <h3 className="text-gray-900 text-sm font-medium line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-2">
            {product.originalPrice && (
              <p className="text-gray-400 text-xs line-through">
                R$ {product.originalPrice.toLocaleString("pt-BR")}
              </p>
            )}
            <p className="text-orange-600 font-semibold text-base">
              R$ {product.price.toLocaleString("pt-BR")}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-700 text-xs font-medium">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 text-xs truncate">{product.location}</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${added
                ? "bg-green-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? "Adicionado!" : "Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </Link>
  );
}