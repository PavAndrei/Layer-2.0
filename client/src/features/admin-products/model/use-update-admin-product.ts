import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminProduct } from '../api';
import { syncAdminProductQueries } from './admin-product-cache';

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: (response, variables) => {
      if (!response.success) return;

      syncAdminProductQueries(queryClient, variables.productId, response);
    },
  });
};
