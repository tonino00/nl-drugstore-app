import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutThunk } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, csrfToken, loading } = useAppSelector((s) => s.auth);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      csrfToken,
      loading,
      logout: () => dispatch(logoutThunk()),
    }),
    [user, isAuthenticated, csrfToken, loading, dispatch]
  );
};
