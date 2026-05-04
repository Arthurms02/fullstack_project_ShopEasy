import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ProductState } from '../../types';


const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<ProductState['products']>) {
      state.products = action.payload;
      state.loading = false;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productSlice.actions;

export default productSlice.reducer;