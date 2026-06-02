import api from './api';

export interface PharmacyDayHours {
  day_of_week: number;
  opening_time?: string | null;
  closing_time?: string | null;
  is_open: boolean;
}

export interface PharmacyStatusResponse {
  open: boolean;
}

export interface NextOpeningResponse {
  day_of_week: number;
  opening_time: string;
}

export const pharmacyService = {
  async getHours() {
    const { data } = await api.get<PharmacyDayHours[]>('/pharmacy-hours');
    return data;
  },
  async updateHours(payload: PharmacyDayHours[]) {
    const { data } = await api.put<{ ok: boolean }>('/pharmacy-hours', payload);
    return data;
  },
  async status() {
    const { data } = await api.get<PharmacyStatusResponse>('/pharmacy-hours/status');
    return data;
  },
  async nextOpening() {
    const { data } = await api.get<NextOpeningResponse>('/pharmacy-hours/next-opening');
    return data;
  },
};
