import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAdminProduct } from '../api';
import { adminProductsQueryKeys } from './admin-products-query-keys';

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminProduct,
    onSuccess: (response) => {
      if (!response.success) return;

      queryClient.invalidateQueries({
        queryKey: adminProductsQueryKeys.lists(),
      });
    },
  });
};
