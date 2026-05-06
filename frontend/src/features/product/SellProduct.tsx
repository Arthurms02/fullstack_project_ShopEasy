import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  ArrowLeft,
  CheckCircle,
  Info,
  DollarSign,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProduct } from "./productAPI";

// POST /products → { name, description, price, stock, image_url }
const schema = yup.object({
  name: yup
    .string()
    .min(5, "Nome muito curto (mín. 5 caracteres)")
    .max(120, "Máximo 120 caracteres")
    .required("Nome é obrigatório"),
  description: yup
    .string()
    .min(20, "Descrição muito curta (mín. 20 caracteres)")
    .max(1500, "Máximo 1500 caracteres")
    .required("Descrição é obrigatória"),
  price: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, "Informe um preço válido (ex: 199.90)")
    .required("Preço é obrigatório"),
  stock: yup
    .number()
    .typeError("Informe uma quantidade válida")
    .integer("Deve ser um número inteiro")
    .min(0, "Estoque não pode ser negativo")
    .max(2147483647, "Valor máximo excedido")
    .required("Estoque é obrigatório"),
  image_url: yup
    .string()
    .url("Informe uma URL válida (ex: https://...)")
    .required("URL da imagem é obrigatória"),
});

type FormValues = yup.InferType<typeof schema>;

// Campos validados em cada step
const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["name", "price", "stock"],
  2: ["description"],
  3: ["image_url"],
};


export default function Sell() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [apiPreview, setApiPreview] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: undefined,
      image_url: "",
    },
    mode: "onChange",
  });

  const nameValue = watch("name") ?? "";
  const descriptionValue = watch("description") ?? "";
  const priceValue = watch("price") ?? "";
  const stockValue = watch("stock");
  const imageUrlValue = watch("image_url") ?? "";

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data: FormValues) => {
    // Payload que seria enviado para POST /products
    console.log("POST /products →", data);
    createProduct(data);
    setSubmitted(true);
    setTimeout(() => navigate("/"), 3000);
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;


  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-gray-900 mb-2">Anúncio publicado!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Seu produto foi enviado para revisão e será publicado em breve.
          </p>
          <p className="text-gray-400 text-xs">Redirecionando para o início...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, label: "Produto" },
    { number: 2, label: "Descrição" },
    { number: 3, label: "Imagem" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-gray-900">Anunciar Produto</h1>
            <p className="text-gray-500 text-sm">Publique seu anúncio gratuitamente</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step > s.number
                    ? "bg-green-500 text-white"
                    : step === s.number
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.number ? "✓" : s.number}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step === s.number ? "text-orange-600 font-medium" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 ${
                    step > s.number ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Step 1: name, price, stock ── */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Package className="w-5 h-5 text-orange-500" />
                <h2 className="text-base">Informações do Produto</h2>
              </div>

              {/* name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Nome do Produto *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Ex: iPhone 14 Pro Max 256GB Preto"
                  maxLength={120}
                  className={inputClass(!!errors.name)}
                />
                <div className="flex justify-between mt-1">
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                  )}
                  <p className="text-gray-400 text-xs ml-auto">{nameValue.length}/120</p>
                </div>
              </div>

              {/* price + stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("price")}
                      type="text"
                      inputMode="decimal"
                      placeholder="199.90"
                      className={`${inputClass(!!errors.price)} pl-9`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">Formato: 199.90</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Estoque *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("stock")}
                      type="number"
                      min={0}
                      placeholder="0"
                      className={`${inputClass(!!errors.stock)} pl-9`}
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Próximo
              </button>
            </div>
          )}

          {/* ── Step 2: description ── */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Info className="w-5 h-5 text-orange-500" />
                <h2 className="text-base">Descrição do Produto</h2>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Descrição *
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Descreva o produto com detalhes: especificações, estado de conservação, acessórios inclusos..."
                  rows={6}
                  maxLength={1500}
                  className={`${inputClass(!!errors.description)} resize-none`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-red-500 text-xs">{errors.description.message}</p>
                  )}
                  <p className="text-gray-400 text-xs ml-auto">
                    {descriptionValue.length}/1500
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 flex gap-3">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-700 text-sm font-medium">Dicas para uma boa descrição</p>
                  <ul className="text-orange-600 text-xs mt-1 space-y-1">
                    <li>• Mencione marca, modelo e especificações técnicas</li>
                    <li>• Informe o estado de conservação</li>
                    <li>• Liste todos os acessórios inclusos</li>
                    <li>• Seja honesto sobre possíveis defeitos</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: image_url + preview ── */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <ImageIcon className="w-5 h-5 text-orange-500" />
                <h2 className="text-base">Imagem do Produto</h2>
              </div>

              {/* image_url */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  URL da Imagem *
                </label>
                <input
                  {...register("image_url")}
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className={inputClass(!!errors.image_url)}
                />
                {errors.image_url && (
                  <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>
                )}
              </div>

              {/* Imagem preview */}
              {imageUrlValue && !errors.image_url && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={imageUrlValue}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Zona de upload visual (sem funcionalidade real) */}
              {!imageUrlValue && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Upload de arquivo</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Disponível com integração ao backend
                  </p>
                </div>
              )}

              {/* Pré-visualização do anúncio */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                  Resumo do Anúncio
                </p>
                <div className="flex items-start gap-3">
                  {imageUrlValue ? (
                    <img
                      src={imageUrlValue}
                      alt="produto"
                      className="w-16 h-16 object-cover rounded-lg bg-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-medium line-clamp-1">
                      {nameValue || "Nome do produto"}
                    </p>
                    <p className="text-orange-600 font-semibold mt-0.5">
                      {priceValue ? `R$ ${Number(priceValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ --"}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Estoque: {stockValue ?? "--"} un.
                    </p>
                  </div>
                </div>
              </div>

              {/* API payload preview */}
              <button
                type="button"
                onClick={() => setApiPreview((v) => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                {apiPreview ? "Ocultar" : "Ver"} payload da API
              </button>
              {apiPreview && (
                <div className="bg-gray-900 rounded-xl p-4">
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        name: nameValue,
                        description: descriptionValue,
                        price: priceValue,
                        stock: stockValue ?? 0,
                        image_url: imageUrlValue,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Publicar Anúncio
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
