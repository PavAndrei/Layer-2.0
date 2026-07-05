import { useMutation, useQueryClient } from '@tanstack/react-query';

import { confirmEmailVerification } from '../api';
import { syncAuthUser } from './auth-user-cache';
import { useAuthStore } from './auth-store';
import type { EmailVerificationConfirmPayload } from './auth-types';

export const useConfirmEmailVerification = () => {
  const queryClient = useQueryClient();
  const authStatus = useAuthStore((state) => state.status);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: EmailVerificationConfirmPayload) =>
      confirmEmailVerification(payload),
    onSuccess: (response) => {
      if (!response.success) return;
      if (authStatus !== 'authenticated') return;

      syncAuthUser({
        queryClient,
        setUser,
        user: response.data.user,
      });
    },
  });
};
