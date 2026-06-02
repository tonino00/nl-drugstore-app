import api from './api';
import type { Medicine } from '../types/medicine.types';
import type { PaginatedResponse } from '../types/api.types';

export interface StockMovementUser {
  id: number;
  nome: string;
  email: string;
}

export interface StockMovement {
  id: number;
  medicine_id: number;
  tipo: 'entrada' | 'saida' | 'ajuste' | string;
  quantidade: number;
  motivo: string;
  observacao?: string | null;
  usuario_id: number;
  created_at: string;
  user?: StockMovementUser;
}

export interface MedicineQuery {
  q?: string;
  categoria?: string;
  page?: number;
  limit?: number;
}

export const medicineService = {
  async list(query: MedicineQuery) {
    if (query.q || query.categoria) {
      const { data } = await api.get<Medicine[]>('/medicines/search', {
        params: { q: query.q, categoria: query.categoria },
      });

      return {
        items: data,
        page: 1,
        pageSize: data.length,
        total: data.length,
      } satisfies PaginatedResponse<Medicine>;
    }

    const { data } = await api.get<{ count: number; page: number; limit: number; rows: Medicine[] }>(
      '/medicines',
      { params: { page: query.page, limit: query.limit } }
    );

    return {
      items: data.rows,
      page: data.page,
      pageSize: data.limit,
      total: data.count,
    } satisfies PaginatedResponse<Medicine>;
  },
  async search(query: { q?: string; categoria?: string }) {
    const { data } = await api.get<Medicine[]>('/medicines/search', { params: query });
    return data;
  },
  async categories() {
    const { data } = await api.get<string[]>('/medicines/categories');
    return data;
  },
  async getById(id: number | string) {
    const { data } = await api.get<Medicine>(`/medicines/${id}`);
    return data;
  },
  async create(payload: Partial<Medicine>) {
    const { data } = await api.post<Medicine>('/medicines', payload);
    return data;
  },
  async update(id: number | string, payload: Partial<Medicine>) {
    const { data } = await api.put<Medicine>(`/medicines/${id}`, payload);
    return data;
  },
  async patchStock(
    id: number | string,
    payload: { delta: number; motivo: string; observacao?: string }
  ) {
    const { data } = await api.patch<Medicine>(`/medicines/${id}/stock`, payload);
    return data;
  },
  async movements(id: number | string, query: { page?: number; limit?: number }) {
    const { data } = await api.get<{
      movements: StockMovement[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/medicines/${id}/movements`, { params: query });

    return {
      items: data.movements,
      page: data.pagination.page,
      pageSize: data.pagination.limit,
      total: data.pagination.total,
    } satisfies PaginatedResponse<StockMovement>;
  },
  async expiring(days: number) {
    const { data } = await api.get<Medicine[]>('/medicines/expiring', { params: { days } });
    return data;
  },
  async lowStock() {
    const { data } = await api.get<Medicine[]>('/medicines/low-stock');
    return data;
  },
  async stockSummary(days = 7) {
    const { data } = await api.get<{ labels: string[]; entradas: number[]; saidas: number[] }>(
      '/medicines/stock-summary',
      { params: { days } }
    );
    return data;
  },
  async remove(id: number | string) {
    const { data } = await api.delete<{ message: string }>(`/medicines/${id}`);
    return data;
  },
};
