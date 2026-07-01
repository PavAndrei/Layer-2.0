import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '../api';
import { setGuestAuthBootstrapQueryData } from './auth-query-cache';
import { useAuthStore } from './auth-store';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      setGuestAuthBootstrapQueryData(queryClient);
    },
  });
};
