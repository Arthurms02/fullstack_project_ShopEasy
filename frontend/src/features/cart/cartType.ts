import type { Product } from '../product/productType';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
}