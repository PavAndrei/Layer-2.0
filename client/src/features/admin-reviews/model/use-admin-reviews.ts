import { useQuery } from '@tanstack/react-query';

import {
  getAdminReviews,
  type AdminReviewsParams,
} from '../api';
import { adminReviewsQueryKeys } from './admin-reviews-query-keys';
import { toAdminReviewsSearchParams } from './admin-reviews-search-params';

const ADMIN_REVIEWS_STALE_TIME_MS = 1000 * 60;

type UseAdminReviewsOptions = {
  enabled?: boolean;
  params?: AdminReviewsParams;
};

export const useAdminReviews = ({
  enabled = true,
  params = {},
}: UseAdminReviewsOptions = {}) => {
  const searchParams = toAdminReviewsSearchParams(params);
  const query = useQuery({
    queryKey: adminReviewsQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getAdminReviews(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_REVIEWS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin reviews'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
    reviews: response?.success ? response.data.reviews : [],
  };
};
