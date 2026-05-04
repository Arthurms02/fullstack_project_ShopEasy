import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/types';
import type { CartItem, CartState } from './cartType';


const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(i => i.product.id !== productId);
        return;
      }
      const it = state.items.find(i => i.product.id === productId);
      if (it) it.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: any) => state.cart.items;
export const selectTotalItems = (state: any) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
export const selectTotalPrice = (state: any) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);