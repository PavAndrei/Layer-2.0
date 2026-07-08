import { useMutation, useQueryClient } from '@tanstack/react-query';

import { orderQueryKeys } from '../../../entities/order';
import { checkout } from '../api';

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkout,
    onSuccess: (response) => {
      if (!response.success) return;

      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.all,
      });
    },
  });
};
