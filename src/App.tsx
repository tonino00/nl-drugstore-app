import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

import { router } from './routes';
import { useSSE } from './hooks/useSSE';
import { useStockAlerts } from './hooks/useStockAlerts';
import { useAppDispatch } from './store/hooks';
import { meThunk } from './store/slices/authSlice';
import { useAppSelector } from './store/hooks';

export default function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const isAuthenticated = auth.isAuthenticated;
  const loading = auth.loading;
  const triedMe = useRef(false);

  useEffect(() => {
    if (isAuthenticated) return;
    if (loading) return;
    if (triedMe.current) return;
    triedMe.current = true;
    dispatch(meThunk());
  }, [dispatch, isAuthenticated, loading]);

  useSSE();
  useStockAlerts();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
