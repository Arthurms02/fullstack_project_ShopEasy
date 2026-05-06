import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartState, CartItem } from './cartType';
import type { Product } from '../product/productType';


const initialState: CartState = {
  items: [],
  total_items: 0,
  total_price: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ product, quantity: 1, id: Date.now() });

      state.total_items = state.items.reduce((s, i) => s + i.quantity, 0);
      state.total_price = state.items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);
        return;
      }
      const item = state.items.find(item => item.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
    setCart(state, action: PayloadAction<Cart>) {
      const payload = action.payload;
      const items = Array.isArray(payload) ? payload : (payload?.items ?? []);
      state.items = items.map(i => ({ product: i.product, quantity: Number(i.quantity) || 0, id: i.id }));
      state.total_items = (payload?.total_items ?? state.items.reduce((sum, i) => sum + i.quantity, 0)) || 0;
      state.total_price = (payload?.total_price ?? state.items.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.product.price)), 0)) || 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: any) => state.cart.items;
export const selectTotalItems = (state: any) => state.cart.total_items;
export const selectTotalPrice = (state: any) => state.cart.total_price;