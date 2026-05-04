import type { Product } from '../../types/types';
import api from '../../app/api';

export async function fetchCart() {
  const res = await api.get('/api/v1/cart/');
  return res.data; // { id, user, items: [...] }
}

export async function addToCartApi(product: Product) {
  const res = await api.post('/api/v1/cart/', { productId: product.id });
  return res.data;
}

export async function removeFromCartApi(cartItemId: number) {
  const res = await api.delete(`/api/v1/cart/${cartItemId}/`);
  return res.data;
}

export async function updateQuantityApi(cartItemId: number, quantity: number) {
  const res = await api.patch(`/api/v1/cart/${cartItemId}/`, { quantity });
  return res.data;
}