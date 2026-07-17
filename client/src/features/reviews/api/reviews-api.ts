import type { UserReview } from '../../../entities/review';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type UserReviewsParams = {
  limit?: number;
  page?: number;
};

export type UserReviewsResponseData = {
  pagination: PaginationData;
  reviews: UserReview[];
};

export const getUserReviews = async (
  params: UserReviewsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<UserReviewsResponseData>> => {
  return apiClient.get<UserReviewsResponseData>({
    path: '/reviews/me',
    params,
    signal,
    errorMessage: 'Failed to load reviews',
  });
};
