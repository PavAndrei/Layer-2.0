import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import {
  useAuthStatus,
  useIsAuthenticated,
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
  const authStatus = useAuthStatus();
  const isAuthenticated = useIsAuthenticated();

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
