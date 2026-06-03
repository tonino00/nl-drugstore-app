import api from './api';
import type { Batch } from '../types/batch.types';

interface StockMovementEntradaPayload {
  medicineId: number;
  type: 'entrada';
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturingDate?: string | null;
  motivo?: string;
  observacao?: string;
}

interface StockMovementSaidaPayload {
  medicineId: number;
  type: 'saida';
  quantity: number;
  motivo?: string;
  pacienteId?: string;
  observacao?: string;
}

export interface ConsumedBatch {
  batchId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

interface StockEntradaData {
  batch: Batch;
}

interface StockSaidaData {
  consumed: ConsumedBatch[];
}

export const stockService = {
  async createEntrada(payload: StockMovementEntradaPayload) {
    const { data } = await api.post<ApiResponse<StockEntradaData>>('/stock/movements', payload);
    return data;
  },

  async createSaida(payload: StockMovementSaidaPayload) {
    const { data } = await api.post<ApiResponse<StockSaidaData>>('/stock/movements', payload);
    return data;
  },
};
