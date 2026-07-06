import { useMutation } from '@tanstack/react-query';

import { requestPasswordReset } from '../api';
import type { PasswordResetRequestPayload } from './auth-types';

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (payload: PasswordResetRequestPayload) =>
      requestPasswordReset(payload),
  });
};
