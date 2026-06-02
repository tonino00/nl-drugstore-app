import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  pharmacyService,
  type NextOpeningResponse,
  type PharmacyDayHours,
  type PharmacyStatusResponse,
} from '../../services/pharmacyService';

interface PharmacyState {
  hours: PharmacyDayHours[] | null;
  status: PharmacyStatusResponse | null;
  nextOpening: NextOpeningResponse | null;
  loading: boolean;
}

const initialState: PharmacyState = {
  hours: null,
  status: null,
  nextOpening: null,
  loading: false,
};

export const fetchPharmacyHoursThunk = createAsyncThunk('pharmacy/hours', async () => {
  return await pharmacyService.getHours();
});

export const fetchPharmacyStatusThunk = createAsyncThunk('pharmacy/status', async () => {
  return await pharmacyService.status();
});

export const fetchNextOpeningThunk = createAsyncThunk('pharmacy/nextOpening', async () => {
  return await pharmacyService.nextOpening();
});

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacyHoursThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPharmacyHoursThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.hours = action.payload;
      })
      .addCase(fetchPharmacyHoursThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPharmacyStatusThunk.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(fetchNextOpeningThunk.fulfilled, (state, action) => {
        state.nextOpening = action.payload;
      });
  },
});

export default pharmacySlice.reducer;
