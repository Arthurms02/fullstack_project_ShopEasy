'use server';

import { Product } from "@/types/type";
import { revalidatePath } from 'next/cache'

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:8000/api/v1/products/", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  const data = await response.json();
  // Retorna 'results' se for paginado ou o próprio 'data' se for array
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function deleteProduct(productId: number, token: string): Promise<void> {
  const response = await fetch(`http://localhost:8000/api/v1/products/${productId}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar produto");
  }
  if (response.ok){
    revalidatePath("/home");
  }
}

