import type { QueryClient } from '@tanstack/react-query';

import type { User } from '../../../entities/user';
import { setAuthBootstrapUserQueryData } from './auth-query-cache';
import type { AuthState } from './auth-store';

export const syncAuthUser = ({
  queryClient,
  setUser,
  user,
}: {
  queryClient: QueryClient;
  setUser: AuthState['setUser'];
  user: User;
}) => {
  setUser(user);
  setAuthBootstrapUserQueryData(queryClient, user);
};
