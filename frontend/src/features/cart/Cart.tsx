import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Trash2,
    ArrowLeft,
    Shield,
    Tag,
    ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, setCart, updateQuantity } from "./cartSlice";
import { clearCartApi, fetchCart, removeFromCartApi, updateQuantityApi } from "./cartAPI";
import type { CartItem } from "./cartType";
import type { RootState } from "../../app/store";



export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    const {items, totalItems, totalPrice } = useSelector((state: RootState ) => state.cart);

    const discount = couponApplied ? totalPrice * 0.1 : 0; // Exemplo: 10% de desconto
    const shipping = totalPrice - discount > 500 ? 0 : 20; // Frete grátis para pedidos acima de R$500
    const finalPrice = totalPrice - discount + shipping;

    useEffect(() => {
        (async () => {
            try {
                const cart = await fetchCart(); // { items: [{id, product, quantity}, ...] }
                const mapped = (cart.items || []).map((i: CartItem) => ({
                    id: i.id,
                    product: i.product,
                    quantity: i.quantity,
                }));
                dispatch(setCart(mapped));
            } catch (e) {
                console.error("Falha ao carregar carrinho:", e);
            }
        })();
    }, [dispatch]);


    const applyCoupon = () => {
        if (coupon === "DESCONTO10") {
            setCouponApplied(true);
        }
    };

    const handleCheckout = () => {
        dispatch(clearCart());
        navigate("/sucesso");
    };


    const handleUpdateQuantity = async (id: number, nova_quantidade: number) => {

        updateQuantity({ id, quantity: nova_quantidade });

        try {
            const response = await updateQuantityApi(id, nova_quantidade);
            if ( response ) {
                // Normaliza: API pode retornar um array ou um objeto { items: [...] }
                const itemsArr = Array.isArray(response) ? response : (response?.items ?? []);
                const mapped = itemsArr.map((i: CartItem) => ({
                    id: i.id,
                    product: i.product,
                    quantity: Number(i.quantity) || 0,
                }));

            dispatch(setCart(mapped)); // sempre um array
       } else {
                console.warn(response);
                console.warn("A API respondeu, mas os dados vieram vazios.");
            }} catch (error: any) {
            console.error("Erro capturado:", error.response?.data || error.message);
        }
    };

    const handleRemoveItem = async (id: number) => {
        try{
            const response = await removeFromCartApi(id);
            console.log("Resposta da API ao remover item:", response);
            if (response.status === 204 || response.status === 200) {
                dispatch(removeFromCart(id));
            } else {
                console.warn("A API respondeu, mas os dados vieram vazios.");
            }
        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
        }
    };

    const handleClearCart = async  () => {
        try {
            const response = await clearCartApi();
            if (response.status === 200 || response.status === 204) {
                dispatch(clearCart());
            } else {
                console.warn("A API respondeu, mas os dados vieram vazios.");
            }
        } catch (error) {
            console.error("Erro ao limpar o carrinho:", error);
        }
    };



    if (items?.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-sm">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-orange-400" />
                    </div>
                    <h2 className="text-gray-800 mb-2">Seu carrinho está vazio</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Explore nossos produtos e encontre algo incrível!
                    </p>
                    <Link
                        to="/produtos"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        Ver Produtos
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continuar comprando
                    </button>
                    <div className="h-4 w-px bg-gray-300" />
                    <h1 className="text-gray-900">
                        Carrinho{" "}
                        <span className="text-gray-500 font-normal text-base">
                            ({totalItems} {totalItems === 1 ? "item" : "itens"})
                        </span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-3">
                        {items?.map(({ id , product, quantity }) => (
                            <div
                                key={id}
                                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
                            >
                                <Link to={`/produto/${product.id}`} className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                                    <img
                                        src={product.image_url ?? product.image_url ?? "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-md"
                                        loading="lazy"
                                    />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between gap-2">
                                        <Link
                                            to={`/produto/${product.id}`}
                                            className="text-gray-900 text-sm font-medium line-clamp-2 hover:text-orange-600 transition-colors"
                                        >
                                            {product.name}
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveItem(id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-1 mb-3">
                                        <span className="text-xs text-gray-500">{product.category}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-500">{product.condition}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                                             onClick={() => {
                                                const newQty = quantity - 1;
                                                if (newQty <= 0) {
                                                    handleUpdateQuantity(id, 0);
                                                } else {
                                                    handleUpdateQuantity(id, newQty);
                                                }

                                            }}> −</button>
                                            <span className="px-3 py-1.5 text-gray-900 text-sm font-medium">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(id, quantity + 1)}
                                                className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500">{product.category ?? ""}</span>
                                            <p className="text-orange-600 font-semibold">
                                                R$ {(product.price * quantity).toLocaleString("pt-BR")}
                                            </p>
                                            {product.price != null && (
                                                <p className="text-gray-400 text-xs line-through">R$ {(product.price * quantity).toLocaleString("pt-BR")}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear cart */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleClearCart()}
                                className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                Limpar carrinho
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
                            <h2 className="text-gray-900 text-base mb-5">Resumo do Pedido</h2>

                            {/* Coupon */}
                            <div className="mb-5">
                                <label className="text-sm text-gray-600 mb-2 block">Cupom de desconto</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
                                        <Tag className="w-4 h-4 text-gray-400 ml-2.5" />
                                        <input
                                            type="text"
                                            placeholder="DESCONTO10"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                            disabled={couponApplied}
                                            className="flex-1 px-2 py-2 outline-none text-sm text-gray-700 bg-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={applyCoupon}
                                        disabled={couponApplied || !coupon}
                                        className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                                {couponApplied && (
                                    <p className="text-green-600 text-xs mt-1.5">
                                        ✓ Cupom aplicado! 10% de desconto
                                    </p>
                                )}
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">
                                        R$ {(totalPrice || 0).toLocaleString("pt-BR")}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Desconto (cupom)</span>
                                        <span className="text-green-600">
                                            -R$ {discount.toLocaleString("pt-BR")}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Frete</span>
                                    <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>
                                        {shipping === 0
                                            ? "Grátis"
                                            : `R$ ${shipping.toLocaleString("pt-BR")}`}
                                    </span>
                                </div>
                                {totalPrice <= 500 && (
                                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                                        💡 Adicione mais R$ {(500 - totalPrice).toLocaleString("pt-BR")} para ganhar frete grátis
                                    </p>
                                )}
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-orange-600 font-semibold text-lg">
                                        R$ {finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-medium mt-5 transition-colors"
                            >
                                Finalizar Compra
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                                <Shield className="w-3.5 h-3.5" />
                                Pagamento 100% seguro
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}