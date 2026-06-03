export type BatchStatus = 'active' | 'expiring_soon' | 'expired' | 'inactive';

export interface Batch {
  id: number;
  medicineId: number;
  batchNumber: string;
  quantity: number;
  manufacturingDate?: string | null;
  expiryDate: string;
  isActive: boolean;
  notes?: string | null;
  daysUntilExpiry?: number | null;
  status?: BatchStatus;
}

export interface BatchSummary {
  totalQuantity: number;
  activeBatches: number;
  expiredBatches: number;
  expiringSoon: number;
}

export interface BatchListResponse {
  rows: Batch[];
  summary: BatchSummary;
}

export interface BatchTraceResult {
  medicineName: string;
  manufacturingDate?: string | null;
  expiryDate?: string | null;
  isValid: boolean;
}
