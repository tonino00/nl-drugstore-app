export type UserRole = 'user' | 'pharmacist' | 'admin';

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  role: UserRole;
  notification_enabled?: boolean;
  avatar_url?: string | null;
  last_login?: string;
}
