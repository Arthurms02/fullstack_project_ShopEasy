import api from '../../app/api';
import type { Product } from './productType';
import type { ListParams }  from './productType';


const BASE = '/api/v1/products/';

// Verificar a necessidade de paginação: se a API suporta paginação, implementar lógica para lidar com múltiplas páginas
export async function listAllProducts(params?: ListParams): Promise<Product[]> {
  const results: Product[] = [];
  let page = 1;

  while (true) {
    const res = await api.get(BASE, { params: { ...params, page } });
    const data = res.data;

    if (Array.isArray(data)) {
      // não paginado
      return data;
    }

    if (data.results) {
      results.push(...data.results);
      if (!data.next) break;
      page += 1;
      continue;
    }

    // fallback: se formato inesperado, tenta devolver como array
    return (data as Product[]) ?? [];
  }

  return results;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get(`${BASE}${id}/`);
  return data;
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post(BASE, payload);
  return data;
}

export async function updateProduct(id: number, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.patch(`${BASE}${id}/`, payload);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`${BASE}${id}/`);
}

export async function restoreProduct(id: number): Promise<Product> {
  const { data } = await api.post(`${BASE}${id}/restore/`);
  return data.data ?? data;
}

export async function fetchFavorites(): Promise<number[]> {
  const res = await api.get('/api/v1/favorites/');
  const listID: number[] = [];

  // Pega o .results se tiver paginação, ou res.data direto se for uma lista simples
  const data = res.data.results || res.data;

  for (const item of data) {
    // Pega o ID do produto (algumas APIs enviam como item.product, outras como item.id)
    listID.push(item.product || item.id); 
  }
  return listID;
}

export async function toggleFavorite(productId: number, isFavorite: boolean): Promise<void> {
  console.log("Toggling favorite for productId:", productId, "isFavorite:", isFavorite);
  if (isFavorite) {
    console.log("Adicionando aos favoritos:", productId);
    await api.post('/api/v1/favorites/', { product: productId });
  }
}

export default {
  listAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  toggleFavorite
};