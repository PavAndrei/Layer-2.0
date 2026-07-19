import type {
  ProductReview,
  UpdateReviewData,
  UserReview,
} from '../../../entities/review';
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

export type UpdateUserReviewParams = {
  review: UpdateReviewData;
  reviewId: string;
};

export type UpdateUserReviewResponseData = {
  review: ProductReview;
};

export type DeleteUserReviewResponseData = {
  productId: string;
  reviewId: string;
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

export const updateUserReview = async ({
  review,
  reviewId,
}: UpdateUserReviewParams): Promise<
  ApiResponse<UpdateUserReviewResponseData>
> => {
  return apiClient.patch<UpdateUserReviewResponseData, UpdateReviewData>({
    path: `/reviews/${reviewId}`,
    body: review,
    errorMessage: 'Failed to update review',
  });
};

export const deleteUserReview = async (
  reviewId: string,
): Promise<ApiResponse<DeleteUserReviewResponseData>> => {
  return apiClient.delete<DeleteUserReviewResponseData>({
    path: `/reviews/${reviewId}`,
    errorMessage: 'Failed to delete review',
  });
};
