import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminProductStatus } from '../api';
import { syncAdminProductQueries } from './admin-product-cache';

export const useUpdateAdminProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProductStatus,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminProductQueries(queryClient, variables.productId, response);
    },
  });
};
