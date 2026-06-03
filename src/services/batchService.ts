import api from './api';
import type { Batch, BatchListResponse, BatchTraceResult, BatchSummary } from '../types/batch.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export type BatchStatusFilter = 'active' | 'expired' | 'all';

const mapBatch = (raw: any): Batch => ({
  id: raw.id,
  medicineId: raw.medicine_id,
  batchNumber: raw.batch_number,
  quantity: raw.quantity,
  manufacturingDate: raw.manufacturing_date ?? null,
  expiryDate: raw.expiry_date,
  isActive: raw.is_active,
  notes: raw.notes ?? null,
  daysUntilExpiry: raw.days_until_expiry ?? raw.daysUntilExpiry ?? null,
  status: raw.status ?? undefined,
});

export const batchService = {
  async createForMedicine(
    medicineId: number | string,
    payload: {
      batchNumber: string;
      quantity: number;
      manufacturingDate?: string | null;
      expiryDate: string;
      notes?: string | null;
    }
  ) {
    const { data } = await api.post<ApiResponse<{ batch: Batch }>>(
      `/medicines/${medicineId}/batches`,
      payload
    );
    return data;
  },

  async listForMedicine(
    medicineId: number | string,
    status: BatchStatusFilter = 'active'
  ) {
    const { data } = await api.get<ApiResponse<{ rows: any[]; summary: BatchSummary }>>(
      `/medicines/${medicineId}/batches`,
      { params: { status } }
    );

    const rows = (data.data.rows || []).map(mapBatch);

    return {
      ...data,
      data: {
        rows,
        summary: data.data.summary,
      },
    } as ApiResponse<BatchListResponse>;
  },

  async expire(batchId: number | string) {
    const { data } = await api.post<ApiResponse<{ batch: Batch }>>(
      `/batches/${batchId}/expire`
    );
    return data;
  },

  async expiring(days = 30) {
    const { data } = await api.get<ApiResponse<{ rows: any[] }>>(
      '/batches/expiring',
      { params: { days } }
    );

    const rows = (data.data.rows || []).map(mapBatch);

    return {
      ...data,
      data: { rows },
    } as ApiResponse<{ rows: Batch[] }>;
  },

  async trace(batchNumber: string) {
    const { data } = await api.get<ApiResponse<BatchTraceResult>>(
      '/batches/trace',
      { params: { batchNumber } }
    );
    return data;
  },
};
