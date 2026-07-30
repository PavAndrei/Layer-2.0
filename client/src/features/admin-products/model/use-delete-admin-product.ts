import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAdminProduct } from '../api';
import type { DeleteAdminProductResponseData } from '../api';
import { syncDeletedAdminProductQueries } from './admin-product-cache';

type UseDeleteAdminProductOptions = {
  onDeleted?: (data: DeleteAdminProductResponseData) => void;
};

export const useDeleteAdminProduct = (
  options: UseDeleteAdminProductOptions = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: (response) => {
      if (!response.success) return;

      syncDeletedAdminProductQueries(queryClient, response);
      options.onDeleted?.(response.data);
    },
  });
};
