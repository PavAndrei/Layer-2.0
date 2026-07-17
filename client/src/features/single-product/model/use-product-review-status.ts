import { useQuery } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import { getProductReviewStatus } from '../api';

type UseProductReviewStatusOptions = {
  isEnabled: boolean;
  productId?: string;
};

export const useProductReviewStatus = ({
  isEnabled,
  productId,
}: UseProductReviewStatusOptions) => {
  const reviewStatusQuery = useQuery({
    queryKey: reviewQueryKeys.productReviewStatus(productId ?? ''),
    enabled: Boolean(productId) && isEnabled,
    retry: false,
    queryFn: async ({ signal }) => {
      if (!productId) {
        throw new Error('Product id is required');
      }

      const response = await getProductReviewStatus(productId, signal);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  return {
    error:
      reviewStatusQuery.error instanceof Error
        ? reviewStatusQuery.error.message
        : reviewStatusQuery.error
          ? 'Failed to load review status'
          : null,
    hasReviewed: reviewStatusQuery.data?.hasReviewed ?? false,
    isFetching: reviewStatusQuery.isFetching,
    isLoading: reviewStatusQuery.isLoading,
    refetch: reviewStatusQuery.refetch,
    review: reviewStatusQuery.data?.review ?? null,
  };
};
