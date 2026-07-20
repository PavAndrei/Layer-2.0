import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminOrder } from '../api';
import { syncAdminOrderQueries } from './admin-order-cache';

export const useUpdateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminOrder,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminOrderQueries(queryClient, variables.orderId, response);
    },
  });
};
