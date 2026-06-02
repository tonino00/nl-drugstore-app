import api from './api';
import type { Medicine } from '../types/medicine.types';

export const favoriteService = {
  async list() {
    const { data } = await api.get<Array<{ Medicine: Medicine } & Record<string, unknown>>>('/favorites');
    return (data || []).map((f) => f.Medicine).filter(Boolean);
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
