'use client';

import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/type";
import { deleteProduct } from "../_services/productAction";



export function ProductItem({ product, isOwner, token }: { product: Product; isOwner: boolean; token: string }) {


  const handleDelete = async () => {
    try {
      if (!token) {
        throw new Error("Token not found");
      }
      await deleteProduct(product.id, token);
      alert("Produto deletado com sucesso!");
      // Optionally, you can refresh the product list or update the UI here
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Por favor, tente novamente.");
    }
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        {isOwner && (
          <div className="absolute top-3 right-3 z-10 flex gap-1">
            <button
              aria-label="Editar"
              className="rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white transition"
            >
              <Pencil size={14} />
            </button>
            <button
              aria-label="Excluir"
              className="rounded-full bg-white/90 p-2 text-red-600 hover:bg-white transition"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
        <Image
          width={100}
          height={100}
          src={product.image_url || "https://via.placeholder.com/150"}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          aria-label={`Adicionar ${product.name}`}
          className="absolute bottom-3 right-3 rounded-full bg-background p-3 opacity-0 shadow-sm transition group-hover:opacity-100"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex items-start justify-between pt-4">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sem categoria</p>
        </div>
        <span className="text-sm">R$ {product.price}</span>
      </div>
    </article>
  );
}