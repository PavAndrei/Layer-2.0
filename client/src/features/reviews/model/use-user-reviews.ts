import { useQuery } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import { getUserReviews } from '../api';
import type { UserReviewsParams } from '../api';

const USER_REVIEWS_STALE_TIME_MS = 1000 * 60;

const toUserReviewsSearchParams = (params: UserReviewsParams) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  return searchParams;
};

type UseUserReviewsOptions = {
  enabled?: boolean;
  params?: UserReviewsParams;
};

export const useUserReviews = ({
  enabled = true,
  params = {},
}: UseUserReviewsOptions = {}) => {
  const searchParams = toUserReviewsSearchParams(params);
  const query = useQuery({
    queryKey: reviewQueryKeys.userList(searchParams.toString()),
    queryFn: ({ signal }) => getUserReviews(params, signal),
    enabled,
    retry: false,
    staleTime: USER_REVIEWS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load reviews'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
    reviews: enabled && response?.success ? response.data.reviews : [],
  };
};
