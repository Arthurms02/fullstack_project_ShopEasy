import { useQuery } from "@tanstack/react-query";
import {
  listAllProducts,
  getProduct,
} from "../features/product/productSlice";

export const QUERY_KEYS = {
  products: ["products"] as const,
  product: (id: number) => ["products", id] as const,
  featured: ["products", "featured"] as const,
};

/** Retorna todos os produtos */
export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: listAllProducts,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}/** Retorna um produto pelo id */
export function useProduct(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// /** Retorna apenas os produtos em destaque */
// export function useFeaturedProducts() {
//   return useQuery({
//     queryKey: QUERY_KEYS.featured,
//     queryFn: fetchFeaturedProducts,
//     staleTime: 1000 * 60 * 5,
//   });
// }
