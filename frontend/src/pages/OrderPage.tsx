import { useNavigate, Navigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Loader2,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  shipping_address: yup
    .string()
    .min(10, "Endereço muito curto (mín. 10 caracteres)")
    .required("Endereço é obrigatório"),
  payment_method: yup
    .string()
    .oneOf(
      ["Cartão de Crédito", "PIX", "Boleto Bancário"],
      "Selecione um método de pagamento"
    )
    .required("Selecione um método de pagamento"),
});

type FormValues = yup.InferType<typeof schema>;

// ── Helpers ───────────────────────────────────────────────────────────────────
const PAYMENT_OPTIONS = [
  {
    value: "Cartão de Crédito",
    icon: "💳",
    label: "Cartão de Crédito",
    desc: "Parcele em até 12x sem juros",
  },
  {
    value: "PIX",
    icon: "⚡",
    label: "PIX",
    desc: "Pagamento instantâneo com 5% de desconto",
  },
  {
    value: "Boleto Bancário",
    icon: "🏦",
    label: "Boleto Bancário",
    desc: "Vence em 3 dias úteis",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      shipping_address: "",
      payment_method: undefined,
    },
  });

  const selectedPayment = watch("payment_method");

  // // Se o carrinho estiver vazio, redireciona
  // if (items.length === 0) {
  //   return <Navigate to="/" replace />;
  // }

  const shipping = totalPrice > 500 ? 0 : 29.9;
  const finalPrice = totalPrice + shipping;

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // const result = await dispatch(
    //   createOrderThunk({
    //     shipping_address: data.shipping_address,
    //     payment_method: data.payment_method,
    //     cartItems: items,
    //     userId: user.id,
    //   })
    // );

    // if (createOrderThunk.fulfilled.match(result)) {
    //   dispatch(clearCart());
    //   navigate(`/sucesso?pedido=${result.payload.id}`);
    // }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/carrinho")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao carrinho
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h1 className="text-gray-900">Finalizar Compra</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left — address + payment */}
            <div className="lg:col-span-2 space-y-5">
              {/* Shipping address */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-gray-900 text-base">Endereço de Entrega</h2>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Endereço completo *
                  </label>
                  <textarea
                    {...register("shipping_address")}
                    rows={3}
                    placeholder="Rua das Flores, 123 – Apto 45&#10;Jardim Primavera, São Paulo – SP&#10;CEP: 01234-567"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none placeholder-gray-400 ${
                      errors.shipping_address ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.shipping_address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-gray-900 text-base">Método de Pagamento</h2>
                </div>

                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map(({ value, icon, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setValue("payment_method", value as FormValues["payment_method"], {
                          shouldValidate: true,
                        })
                      }
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPayment === value
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            selectedPayment === value ? "text-orange-700" : "text-gray-800"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      {/* Radio visual */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPayment === value
                            ? "border-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.payment_method && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.payment_method.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <h2 className="text-gray-900 text-base">Resumo do Pedido</h2>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 text-xs font-medium line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">Qtd: {quantity}</p>
                      </div>
                      <p className="text-gray-900 text-xs font-semibold whitespace-nowrap">
                        R$ {(parseFloat(product.price) * quantity).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">R$ {totalPrice.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frete</span>
                    <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>
                      {shipping === 0 ? "Grátis" : `R$ ${shipping.toLocaleString("pt-BR")}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                    <span className="text-gray-900 font-medium">Total</span>
                    <span className="text-orange-600 font-semibold text-lg">
                      R${" "}
                      {finalPrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-medium mt-5 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Confirmar Pedido
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Pagamento 100% seguro e criptografado
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}