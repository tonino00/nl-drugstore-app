import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Medicine } from '../../types/medicine.types';
import { favoriteService } from '../../services/favoriteService';

interface FavoriteState {
  items: Medicine[];
  loading: boolean;
}

const initialState: FavoriteState = {
  items: [],
  loading: false,
};

export const fetchFavoritesThunk = createAsyncThunk('favorites/list', async () => {
  return await favoriteService.list();
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoritesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavoritesThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default favoriteSlice.reducer;
