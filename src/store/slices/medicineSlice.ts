import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Medicine } from '../../types/medicine.types';
import { medicineService, type MedicineQuery } from '../../services/medicineService';

interface MedicineState {
  items: Medicine[];
  loading: boolean;
  error: string | null;
  lastQuery: MedicineQuery;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: MedicineState = {
  items: [],
  loading: false,
  error: null,
  lastQuery: { page: 1, limit: 10 },
  total: 0,
  page: 1,
  pageSize: 10,
};

export const fetchMedicinesThunk = createAsyncThunk(
  'medicines/list',
  async (query: MedicineQuery, { rejectWithValue }) => {
    try {
      return await medicineService.list(query);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || 'Falha ao carregar medicamentos');
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicinesThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg;
      })
      .addCase(fetchMedicinesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchMedicinesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Falha ao carregar medicamentos';
      });
  },
});

export default medicineSlice.reducer;
