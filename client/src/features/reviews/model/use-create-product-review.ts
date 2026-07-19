import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  reviewQueryKeys,
  type CreateProductReviewData,
} from '../../../entities/review';
import { createProductReview } from '../api';

type UseCreateProductReviewOptions = {
  productId?: string;
};

export const useCreateProductReview = ({
  productId,
}: UseCreateProductReviewOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: CreateProductReviewData) => {
      if (!productId) {
        throw new Error('Product id is required');
      }

      return createProductReview({
        productId,
        review,
      });
    },
    onSuccess: (response) => {
      if (!response.success || !productId) return;

      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.product(productId),
      });

      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.userScoped(),
      });
    },
  });
};
