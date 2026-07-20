import type { QueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import type { ApiResponse } from '../../../shared/api';
import type {
  AdminReviewResponseData,
  DeleteAdminReviewResponseData,
} from '../api';
import { adminReviewsQueryKeys } from './admin-reviews-query-keys';

export const syncUpdatedAdminReviewQueries = (
  queryClient: QueryClient,
  reviewId: string,
  response: ApiResponse<AdminReviewResponseData>,
) => {
  if (!response.success) return;

  const { productId } = response.data.review;

  queryClient.setQueryData<ApiResponse<AdminReviewResponseData>>(
    adminReviewsQueryKeys.detail(reviewId),
    response,
  );
  queryClient.invalidateQueries({
    queryKey: adminReviewsQueryKeys.lists(),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.product(productId),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.userScoped(),
  });
};

export const syncDeletedAdminReviewQueries = (
  queryClient: QueryClient,
  reviewId: string,
  response: ApiResponse<DeleteAdminReviewResponseData>,
) => {
  if (!response.success) return;

  const { productId } = response.data;

  queryClient.removeQueries({
    queryKey: adminReviewsQueryKeys.detail(reviewId),
  });
  queryClient.invalidateQueries({
    queryKey: adminReviewsQueryKeys.lists(),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.product(productId),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.userScoped(),
  });
};
