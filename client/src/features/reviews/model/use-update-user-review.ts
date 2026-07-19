import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import { updateUserReview } from '../api';

export const useUpdateUserReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserReview,
    onSuccess: (response) => {
      if (!response.success) return;

      const { productId } = response.data.review;

      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.userScoped(),
      });
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.product(productId),
      });
    },
  });
};
