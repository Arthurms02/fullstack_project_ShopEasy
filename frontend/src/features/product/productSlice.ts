import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductState } from './productType';


const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  isFavorite: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<ProductState['products']>) {
      state.products = action.payload;
      state.isLoading = false;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    fetchProductByIdStart(state, action: PayloadAction<number>) {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        state.isLoading = true;
      }
      state.isLoading = true;
      state.error = null;
    },
    fetchProductByIdSuccess(state, action: PayloadAction<ProductState['products'][number]>) {
      if (!action.payload) {
        state.error = "Produto não encontrado";
        state.isLoading = false;
        return;
      }
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      } else {
        state.products.push(action.payload);
      }
      state.isLoading = false;
    },
  },
});

export const { fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdStart,
  fetchProductByIdSuccess,
} = productSlice.actions;

export default productSlice.reducer;