"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdutoFormInput, type ProdutoFormData } from "../_schemas/productSchema";
import { ProductFormProps } from "@/types/type";
import { produtoSchema } from "../_schemas/productSchema";



export function ProductForm({ produtoInicial }: ProductFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isEditing = !!produtoInicial?.id;

  // 2. Configurando o React Hook Form com o Resolver do Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormInput, unknown, ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      name: produtoInicial?.name ?? "",
      price: produtoInicial?.price ?? 0,
      description: produtoInicial?.description ?? "",
      stock: produtoInicial?.stock ?? 0,
      image_url: produtoInicial?.image_url ?? null, 
    },
  });

  // 3. Função de Submissão que envia para o DRF
  const onSubmit = async (data: ProdutoFormData) => {
    const url = isEditing
      ? `http://localhost:8000/api/v1/products/${produtoInicial.id}/`
      : `http://localhost:8000/api/v1/products/`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        // Envia os dados já validados e tipados
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Você pode capturar os erros do DRF aqui (ex: restrições de banco)
        const errorData = await res.json();
        console.error("Erro na API:", errorData);
        alert("Falha ao salvar o produto no backend.");
        return;
      }

      alert(`Produto ${isEditing ? "atualizado" : "criado"} com sucesso!`);
      router.push("/produtos");
      router.refresh();
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="flex flex-col gap-4 max-w-md p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {isEditing ? "Editar Produto" : "Novo Produto"}
      </h2>

      {/* Campo Nome */}
      <div className="flex flex-col">
        <label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome</label>
        <input
          id="nome"
          type="text"
          {...register("name")}
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name.message}</span>}
      </div>

      {/* Campo Preço */}
      <div className="flex flex-col">
        <label htmlFor="preco" className="text-sm font-medium text-gray-700">Preço (R$)</label>
        <input
          id="preco"
          type="number"
          step="0.01"
          {...register("price")}
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            errors.price ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.price && <span className="text-sm text-red-500 mt-1">{errors.price.message}</span>}
      </div>

      {/* Campo Descrição */}
      <div className="flex flex-col">
        <label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          id="descricao"
          rows={4}
          {...register("description")}
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.description && <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>}
      </div>
      {/* Campo Estoque */}
      <div className="flex flex-col">
        <label htmlFor="estoque" className="text-sm font-medium text-gray-700">Estoque</label>
        <input
          id="estoque"
          type="number"
          {...register("stock")}
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            errors.stock ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.stock && <span className="text-sm text-red-500 mt-1">{errors.stock.message}</span>}
      </div>

      {/* Campo Imagem */}
      <div className="flex flex-col">
        <label htmlFor="imagem" className="text-sm font-medium text-gray-700">Imagem</label>
        <input
          id="imagem"
          type="file"
          {...register("image_url")}
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.description && <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Produto")}
      </button>
    </form>
  );
}