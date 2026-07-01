import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import {
  selectAuthStatus,
  selectIsAuthenticated,
  useAuthStore,
} from '../model';

type GuestRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export const GuestRoute = ({
  children,
  redirectTo = '/',
}: GuestRouteProps) => {
  const authStatus = useAuthStore(selectAuthStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (authStatus === 'idle' || authStatus === 'loading') {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
