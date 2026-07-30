import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAdminProduct } from '../api';
import { syncDeletedAdminProductQueries } from './admin-product-cache';

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: (response) => {
      if (!response.success) return;

      syncDeletedAdminProductQueries(queryClient, response);
    },
  });
};
