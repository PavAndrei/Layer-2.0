import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import {
  selectAuthStatus,
  selectIsAuthenticated,
  useAuthStore,
} from '../model';

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const authStatus = useAuthStore(selectAuthStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (authStatus === 'idle' || authStatus === 'loading') {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};
