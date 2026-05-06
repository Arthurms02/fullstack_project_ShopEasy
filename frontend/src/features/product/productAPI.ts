import api from '../../app/api';
import type { Product } from './productType';
import type { ListParams }  from './productType';

const BASE = '/api/v1/products/';


/**
 * Faz paginação automática se a resposta for paginada (DRF padrão).
 * Retorna um array de `Product`.
 */
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
  // o backend retorna { message, data: <produto> } para restore
  return data.data ?? data;
}

export default {
  listAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
};