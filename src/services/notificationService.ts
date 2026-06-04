import api from './api';
import type { Notification } from '../types/notification.types';
import type { PaginatedResponse } from '../types/api.types';

export interface NotificationQuery {
  page?: number;
  limit?: number;
  unread?: boolean;
  type?: string;
}

export const notificationService = {
  async list(query: NotificationQuery) {
    const { data } = await api.get<{ count: number; page: number; limit: number; rows: Notification[] }>(
      '/notifications',
      { params: query }
    );

    return {
      items: data.rows,
      page: data.page,
      pageSize: data.limit,
      total: data.count,
    } satisfies PaginatedResponse<Notification>;
  },
  async unreadCount() {
    const { data } = await api.get<{ count: number }>('/notifications/unread-count');
    return data;
  },
  async markAsRead(id: number) {
    const { data } = await api.patch<{ ok: boolean }>(`/notifications/${id}/read`);
    return data;
  },
  async markAllAsRead() {
    const { data } = await api.patch<{ ok: boolean }>('/notifications/read-all');
    return data;
  },
  async remove(id: number) {
    const { data } = await api.delete<{ ok: boolean }>(`/notifications/${id}`);
    return data;
  },
};

export const createNotificationEventSource = (token?: string | null) => {
  const baseUrl = import.meta.env.VITE_SSE_URL;
  const url = token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  return new EventSource(url);
};
