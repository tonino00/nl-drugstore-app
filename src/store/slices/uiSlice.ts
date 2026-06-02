import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  loadingGlobal: boolean;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  loadingGlobal: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoadingGlobal: (state, action: PayloadAction<boolean>) => {
      state.loadingGlobal = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setLoadingGlobal, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
