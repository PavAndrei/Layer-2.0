import { useQuery } from '@tanstack/react-query';

import { getAdminReview } from '../api';
import { adminReviewsQueryKeys } from './admin-reviews-query-keys';

const ADMIN_REVIEW_STALE_TIME_MS = 1000 * 60;

export const useAdminReview = (reviewId: string | undefined) => {
  const query = useQuery({
    queryKey: reviewId
      ? adminReviewsQueryKeys.detail(reviewId)
      : adminReviewsQueryKeys.detail(''),
    queryFn: ({ signal }) => getAdminReview(reviewId ?? '', signal),
    enabled: Boolean(reviewId),
    retry: false,
    staleTime: ADMIN_REVIEW_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin review'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
    review: response?.success ? response.data.review : null,
  };
};
