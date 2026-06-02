import api from './api';
import type { User } from '../types/user.types';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface AuthResponse {
  user: User;
  csrfToken: string | null;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async logout() {
    const { data } = await api.post<{ ok: boolean }>('/auth/logout');
    return data;
  },
  async me() {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
  async updateProfile(payload: {
    nome?: string;
    telefone?: string;
    avatar_url?: string | null;
    notification_enabled?: boolean;
  }) {
    const { data } = await api.put<User>('/auth/profile', payload);
    return data;
  },
  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    const { data } = await api.put<{ ok: boolean }>('/auth/change-password', payload);
    return data;
  },
  async forgotPassword(email: string) {
    const { data } = await api.post<{ ok: boolean }>('/auth/forgot-password', { email });
    return data;
  },
  async verifyResetToken(token: string) {
    const { data } = await api.post<{ valid: boolean }>('/auth/verify-reset-token', { token });
    return data;
  },
  async resetPassword(token: string, newPassword: string) {
    const { data } = await api.post<{ ok: boolean }>('/auth/reset-password', { token, newPassword });
    return data;
  },
};
