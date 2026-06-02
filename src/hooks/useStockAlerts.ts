import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNotification } from '../store/slices/notificationSlice';
import { medicineService } from '../services/medicineService';
import type { Medicine } from '../types/medicine.types';

export const useStockAlerts = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const userRole = useAppSelector((s) => s.auth.user?.role);
  const isStaff = userRole === 'admin' || userRole === 'pharmacist';
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!isAuthenticated || !isStaff) return;

    const checkLowStock = async () => {
      try {
        // Usar list() e filtrar no frontend porque /low-stock do backend
        // não considera quantidade == quantidade_minima como baixo
        const { items } = await medicineService.list({ page: 1, limit: 999 });
        const medicines = (items || []).filter(
          (m: Medicine) => m.quantidade <= (m.quantidade_minima || 0)
        );
        if (!medicines.length) return;

        // Sempre criar/atualizar notificações no store
        medicines.forEach((m: Medicine) => {
          if (!m.nome) return;
          dispatch(
            addNotification({
              id: Date.now() + m.id,
              title: 'Estoque baixo',
              body: `${m.nome} está com apenas ${m.quantidade} unidade(s) restante(s).`,
              type: 'stock',
              read: false,
              created_at: new Date().toISOString(),
            })
          );
        });

        // Toast apenas na primeira execução (montagem) para não spamar
        if (firstRun.current) {
          firstRun.current = false;
          const first = medicines.find((m: Medicine) => !!m.nome);
          if (medicines.length === 1 && first) {
            toast.error(`⚠️ Estoque baixo: ${first.nome} (${first.quantidade} un)`, { duration: 8000 });
          } else {
            toast.error(`⚠️ ${medicines.length} medicamentos com estoque baixo`, { duration: 8000 });
          }
        }
      } catch {
        // Silencioso em erro
      }
    };

    checkLowStock();
    timerRef.current = setInterval(checkLowStock, 2 * 60 * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuthenticated, isStaff, dispatch]);
};
