import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import { deleteUserReview } from '../api';

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserReview,
    onSuccess: (response) => {
      if (!response.success) return;

      const { productId } = response.data;

      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.userScoped(),
      });
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.product(productId),
      });
    },
  });
};

export const useDeleteUserReview = useDeleteReview;
