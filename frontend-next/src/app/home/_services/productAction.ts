import { Product } from "@/types/type";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}