import api from './api';
import type { Medicine } from '../types/medicine.types';

export const favoriteService = {
  async list() {
    const { data } = await api.get<Medicine[]>('/favorites');
    return data;
  },
  async add(medicineId: number) {
    const { data } = await api.post<{ ok: boolean }>(`/favorites/${medicineId}`);
    return data;
  },
  async remove(medicineId: number) {
    const { data } = await api.delete<{ ok: boolean }>(`/favorites/${medicineId}`);
    return data;
  },
  async enableRestockNotify(medicineId: number) {
    const { data } = await api.post<{ ok: boolean }>(`/favorites/${medicineId}/notify`);
    return data;
  },
};
