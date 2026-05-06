import type { Product } from '../product/productType';

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export type CartState = {
  items: CartItem[];
  total_items?: number;
  total_price?: number;
}