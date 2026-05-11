import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  items: [], // Lista de IDs dos produtos favoritados
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    toggleFavoriteInStore: (state, action) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter(favId => favId !== id);
      } else {
        state.items.push(id);
      }
    }
  }
});

export const { setFavorites, toggleFavoriteInStore } = favoritesSlice.actions;

export default favoritesSlice.reducer;