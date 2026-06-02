export type NotificationType =
  | 'stock'
  | 'expiry'
  | 'favorite_restock'
  | 'system'
  | 'sla_warning';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  data?: unknown;
}
