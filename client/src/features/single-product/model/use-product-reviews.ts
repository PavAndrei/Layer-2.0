import { useQuery } from '@tanstack/react-query';

import { getProductReviews } from '../api';
import { singleProductQueryKeys } from './single-product-query-keys';

type UseProductReviewsParams = {
  isEnabled: boolean;
  limit?: number;
  page?: number;
  productId?: string;
};

export const useProductReviews = ({
  isEnabled,
  limit = 5,
  page = 1,
  productId,
}: UseProductReviewsParams) => {
  const reviewsQuery = useQuery({
    queryKey: singleProductQueryKeys.reviews(productId ?? '', page, limit),
    enabled: Boolean(productId) && isEnabled,
    retry: false,
    queryFn: async ({ signal }) => {
      if (!productId) {
        throw new Error('Product id is required');
      }

      const response = await getProductReviews(
        productId,
        {
          limit,
          page,
        },
        signal,
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  return {
    reviews: reviewsQuery.data?.reviews ?? [],
    summary: reviewsQuery.data?.summary ?? {
      averageRating: 0,
      count: 0,
    },
    pagination: reviewsQuery.data?.pagination ?? {
      limit,
      page,
      total: 0,
      totalPages: 0,
    },
    isLoading: reviewsQuery.isLoading,
    isFetching: reviewsQuery.isFetching,
    error:
      reviewsQuery.error instanceof Error
        ? reviewsQuery.error.message
        : reviewsQuery.error
          ? 'Failed to load reviews'
          : null,
    refetch: reviewsQuery.refetch,
  };
};
