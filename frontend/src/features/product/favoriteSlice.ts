import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, Fav, FavoritesState } from './productType';


const initialState: FavoritesState = {
  items: [], // Lista de IDs dos produtos favoritados
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Product>) => {
      state.items = [...state.items, action.payload.id];
    },
    setFavoritesList: (state, action: PayloadAction<number[]>) => {
      state.items = action.payload;
    },
    removeFavorite: (state, action: PayloadAction<Product>) => {
      state.items = state.items.filter(id => id !== action.payload.id);
    }
  }
});

export const { setFavorites, setFavoritesList, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;