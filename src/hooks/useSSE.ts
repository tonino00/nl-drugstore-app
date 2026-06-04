import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNotification } from '../store/slices/notificationSlice';
import { createNotificationEventSource } from '../services/notificationService';

export const useSSE = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const csrfToken = useAppSelector((state) => state.auth.csrfToken);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let alive = true;

    const connectSSE = () => {
      if (!alive) return;

      const eventSource = createNotificationEventSource(csrfToken);

      eventSource.addEventListener('notification', (event) => {
        const notification = JSON.parse((event as MessageEvent).data);
        if (!notification?.title || !notification?.body) return;
        dispatch(addNotification(notification));
        toast.success(notification.title, { duration: 5000 });
      });

      eventSource.addEventListener('favorite_restock', (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        if (!data?.medicine_name) return;
        toast.success(`${data.medicine_name} está disponível novamente!`, {
          duration: 10000,
        });
      });

      eventSource.addEventListener('sla_warning', (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        if (!data?.message) return;
        toast.error(`${data.message}`, { duration: 10000 });
      });

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };

      eventSourceRef.current = eventSource;
    };

    connectSSE();

    return () => {
      alive = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isAuthenticated, csrfToken, dispatch]);
};
