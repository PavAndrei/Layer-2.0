import { useQuery } from '@tanstack/react-query';

import {
  reviewQueryKeys,
  type ProductReview,
} from '../../../entities/review';
import { getProductReviews } from '../api';
import { toReviewsSearchParams } from './review-search-params';

type UseProductReviewsParams = {
  isEnabled: boolean;
  limit?: number;
  page?: number;
  productId?: string;
};

const EMPTY_PRODUCT_REVIEWS: ProductReview[] = [];

export const useProductReviews = ({
  isEnabled,
  limit = 5,
  page = 1,
  productId,
}: UseProductReviewsParams) => {
  const searchParams = toReviewsSearchParams({ limit, page });
  const reviewsQuery = useQuery({
    queryKey: reviewQueryKeys.productList(
      productId ?? '',
      searchParams.toString(),
    ),
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
    error:
      reviewsQuery.error instanceof Error
        ? reviewsQuery.error.message
        : reviewsQuery.error
          ? 'Failed to load reviews'
          : null,
    isFetched: reviewsQuery.isFetched,
    isFetching: reviewsQuery.isFetching,
    isLoading: reviewsQuery.isLoading,
    pagination: reviewsQuery.data?.pagination ?? {
      limit,
      page,
      total: 0,
      totalPages: 0,
    },
    refetch: reviewsQuery.refetch,
    reviews: reviewsQuery.data?.reviews ?? EMPTY_PRODUCT_REVIEWS,
    summary: reviewsQuery.data?.summary ?? {
      averageRating: 0,
      count: 0,
    },
  };
};
