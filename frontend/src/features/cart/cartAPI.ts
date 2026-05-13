import type { Product } from '../product/productType';
import api from '../../services/api';

export async function fetchCart() {
  const res = await api.get('/api/v1/cart/');
  return res.data; // { id, user, items: [...] }
}

export async function addToCartApi(product: Product, quantity: number) {
  const res = await api.post('/api/v1/cart-items/', { product: product.id, quantity: quantity });
  return res.data;
}

export async function removeFromCartApi(cartItemId: number) {
  const res = await api.delete(`/api/v1/cart-items/${cartItemId}/`);
  return res;
}

export async function clearCartApi() {
  const res = await api.delete('/api/v1/cart/clear/');
  return res;
}

export async function updateQuantityApi(id: number, quantity: number) {
  const res = await api.patch(`/api/v1/cart-items/${id}/`, {quantity });
  return res.data;
}