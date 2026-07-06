import { useMutation } from '@tanstack/react-query';

import { confirmPasswordReset } from '../api';
import type { PasswordResetConfirmPayload } from './auth-types';

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: (payload: PasswordResetConfirmPayload) =>
      confirmPasswordReset(payload),
  });
};
