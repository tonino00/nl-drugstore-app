import { format } from 'date-fns';

export const formatDate = (iso?: string | null) => {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return format(date, 'dd/MM/yyyy');
};
