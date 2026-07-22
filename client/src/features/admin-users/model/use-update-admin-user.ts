import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminUser } from '../api';
import { syncAdminUserQueries } from './admin-user-cache';

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminUserQueries(queryClient, variables.userId, response);
    },
  });
};
