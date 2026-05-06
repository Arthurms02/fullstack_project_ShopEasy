import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductState } from './productType';


const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
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
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure   } = productSlice.actions;

export default productSlice.reducer;