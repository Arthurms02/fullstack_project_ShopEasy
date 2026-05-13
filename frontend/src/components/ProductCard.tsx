import { Link } from "react-router";
import { ShoppingCart, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ProductCardProps } from "../features/product/productType";
import { addToCart } from "../features/cart/cartSlice";
import { addToCartApi } from "../features/cart/cartAPI";
import { toggleFavorite } from "../features/product/productAPI";
import { setFavorites, removeFavorite } from "../features/product/favoriteSlice";
import type { RootState } from "../app/store";



export default function ProductCard({ product }: ProductCardProps) {

  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const favorite = useSelector((state: RootState) => state.favorites.items.includes(product.id));

  // useEffect(() => {
  //   // Sincroniza o estado local com o estado global de favoritos
  //   // Isso é útil caso o usuário tenha favoritado/desfavoritado o produto em outra parte do app
  // }, [favorite]);

  const generateRandomDiscount = (productId: number): number => {
  // Usa o ID como seed para gerar sempre o mesmo desconto
  const seed = productId * 9301 + 49297;
  const random = (seed % 233280) / 233280;
  return Math.round(random * 80); // 0-80%
  };

  const discount = generateRandomDiscount(product.id!);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    try {

      await addToCartApi(product, 1);

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (favorite) {
        dispatch(removeFavorite(product));
      } else {
        dispatch(setFavorites(product));
      }
      await toggleFavorite(product.id!);
    } catch (error)
     {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const conditionColor = {
    Novo: "bg-green-100 text-green-700",
    Seminovo: "bg-blue-100 text-blue-700",
    Usado: "bg-gray-100 text-gray-600",
  }[product.condition ?? 'Novo'] || "bg-gray-100 text-gray-600";

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
              className={`w-4 h-4 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
          <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor}`}>
            {product.condition}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-gray-900 text-sm font-medium line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-2">

              <p className="text-gray-400 text-xs line-through">
                R$ {Number((product.price * 1.2)).toLocaleString("pt-BR")}
              </p>
            <p className="text-orange-600 font-semibold text-base">
              R$ {Number(product.price).toLocaleString("pt-BR")}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Em até 12x de R${" "}
              {(product.price / 12).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
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