import { useMutation, useQueryClient } from '@tanstack/react-query';

import { revokeAdminUserSessions } from '../api';
import { syncAdminUserQueries } from './admin-user-cache';

export const useRevokeAdminUserSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeAdminUserSessions,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminUserQueries(queryClient, variables.userId, response);
    },
  });
};
