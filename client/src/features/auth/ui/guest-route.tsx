import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import {
  useAuthStatus,
  useIsAuthenticated,
} from '../model';

type GuestRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export const GuestRoute = ({
  children,
  redirectTo = '/',
}: GuestRouteProps) => {
  const authStatus = useAuthStatus();
  const isAuthenticated = useIsAuthenticated();

  if (authStatus === 'idle' || authStatus === 'loading') {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
