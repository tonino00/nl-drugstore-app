import { Suspense, lazy, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '../components/Layout/AppLayout';
import PrivateRoute from '../components/Common/PrivateRoute';
import Loader from '../components/Common/Loader';
import type { UserRole } from '../types/user.types';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const ListMedicines = lazy(() => import('../pages/Medicines/ListMedicines'));
const MedicineDetail = lazy(() => import('../pages/Medicines/MedicineDetail'));
const MedicineForm = lazy(() => import('../pages/Medicines/MedicineForm'));

const Favorites = lazy(() => import('../pages/Favorites'));
const StockInventory = lazy(() => import('../pages/Stock/StockInventory'));
const StockControl = lazy(() => import('../pages/Stock/StockControl'));
const StockMovements = lazy(() => import('../pages/Stock/StockMovements'));

const Notifications = lazy(() => import('../pages/Notifications'));
const PharmacyHours = lazy(() => import('../pages/PharmacyHours'));
const Profile = lazy(() => import('../pages/Profile'));
const BatchTrace = lazy(() => import('../pages/BatchTrace'));

const withSuspense = (el: ReactElement) => (
  <Suspense fallback={<Loader fullScreen />}>
    {el}
  </Suspense>
);

const staffRoles: UserRole[] = ['admin', 'pharmacist'];

export const router = createBrowserRouter([
  { path: '/login', element: withSuspense(<Login />) },
  { path: '/register', element: withSuspense(<Register />) },
  { path: '/forgot-password', element: withSuspense(<ForgotPassword />) },
  { path: '/reset-password', element: withSuspense(<ResetPassword />) },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/medicines" /> },
          { path: '/medicines', element: withSuspense(<ListMedicines />) },
          { path: '/medicines/:id', element: withSuspense(<MedicineDetail />) },
          { path: '/notifications', element: withSuspense(<Notifications />) },
          { path: '/profile', element: withSuspense(<Profile />) }
          ,
          {
            element: <PrivateRoute roles={staffRoles} />,
            children: [
              { path: '/dashboard', element: withSuspense(<Dashboard />) },
              { path: '/medicines/new', element: withSuspense(<MedicineForm />) },
              { path: '/medicines/:id/edit', element: withSuspense(<MedicineForm />) },
              { path: '/stock/inventory', element: withSuspense(<StockInventory />) },
              { path: '/stock/manage/:medicineId', element: withSuspense(<StockControl />) },
              { path: '/stock/movements/:medicineId', element: withSuspense(<StockMovements />) },
              { path: '/pharmacy-hours', element: withSuspense(<PharmacyHours />) },
            ],
          },
          {
            element: <PrivateRoute roles={['user']} />,
            children: [
              { path: '/favorites', element: withSuspense(<Favorites />) },
            ],
          },
          { path: '/batch-trace', element: withSuspense(<BatchTrace />) },
        ]
      }
    ]
  }
]);
