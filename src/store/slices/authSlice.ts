import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { User, UserRole } from '../../types/user.types';
import { authService } from '../../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  csrfToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  csrfToken: null,
  loading: false,
  error: null,
};

const normalizeRole = (role: any): UserRole => {
  const r = String(role || '').trim().toLowerCase();
  if (r === 'farmaceutico' || r === 'farmacêutico') return 'pharmacist';
  if (r === 'pharmacist' || r === 'admin' || r === 'user') return r as UserRole;
  return 'user';
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; senha: string }, { rejectWithValue }) => {
    try {
      const { user, csrfToken } = await authService.login(payload);
      return { user, csrfToken };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || 'Falha no login');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    payload: { nome: string; email: string; senha: string; telefone?: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, csrfToken } = await authService.register(payload);
      return { user, csrfToken };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || 'Falha no cadastro');
    }
  }
);

export const meThunk = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.me();
    return user;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || 'Falha ao carregar usuário');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return true;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || 'Falha ao sair');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.csrfToken = null;
      state.error = null;
      state.loading = false;
    },
    setAuth: (state, action: PayloadAction<{ user: User; csrfToken?: string | null }>) => {
      state.user = { ...action.payload.user, role: normalizeRole(action.payload.user?.role) };
      state.isAuthenticated = true;
      state.csrfToken = action.payload.csrfToken ?? state.csrfToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE as any, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, role: normalizeRole(action.payload.user?.role) };
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrfToken ?? null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Falha no login';
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, role: normalizeRole(action.payload.user?.role) };
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrfToken ?? null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Falha no cadastro';
        state.isAuthenticated = false;
      })
      .addCase(meThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload, role: normalizeRole(action.payload?.role) };
        state.isAuthenticated = true;
      })
      .addCase(meThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.csrfToken = null;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
