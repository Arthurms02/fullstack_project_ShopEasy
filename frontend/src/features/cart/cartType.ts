import type { Product } from '../product/productType';

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}