import { useMutation, useQueryClient } from '@tanstack/react-query';

import { requestEmailVerification } from '../api';
import { syncAuthUser } from './auth-user-cache';
import { useAuthStore } from './auth-store';

export const useRequestEmailVerification = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: requestEmailVerification,
    onSuccess: (response) => {
      if (!response.success) return;

      syncAuthUser({
        queryClient,
        setUser,
        user: response.data.user,
      });
    },
  });
};
