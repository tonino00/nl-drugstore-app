import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../store/hooks';
import type { UserRole } from '../../types/user.types';

export default function PrivateRoute({ roles }: { roles?: UserRole[] }) {
  const location = useLocation();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const role = useAppSelector((s) => s.auth.user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/medicines" replace />;
  }

  return <Outlet />;
}
