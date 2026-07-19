import type {
  CreateProductReviewData,
  ProductReview,
  ProductReviewStatus,
  ProductReviewsSummary,
  UpdateReviewData,
  UserReview,
} from '../../../entities/review';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type ReviewsPaginationParams = {
  limit?: number;
  page?: number;
};

export type UserReviewsParams = ReviewsPaginationParams;

export type ProductReviewsParams = Required<ReviewsPaginationParams>;

export type ReviewsListResponseData<TReview> = {
  pagination: PaginationData;
  reviews: TReview[];
};

export type UserReviewsResponseData = ReviewsListResponseData<UserReview>;

export type ProductReviewsResponseData =
  ReviewsListResponseData<ProductReview> & {
  summary: ProductReviewsSummary;
};

export type CreateProductReviewParams = {
  productId: string;
  review: CreateProductReviewData;
};

export type CreateProductReviewResponseData = {
  review: ProductReview;
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

export const getProductReviews = async (
  productId: string,
  params: ProductReviewsParams,
  signal?: AbortSignal,
): Promise<ApiResponse<ProductReviewsResponseData>> => {
  return apiClient.get<ProductReviewsResponseData>({
    path: `/products/${productId}/reviews`,
    params,
    signal,
    errorMessage: 'Failed to load product reviews',
  });
};

export const getProductReviewStatus = async (
  productId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<ProductReviewStatus>> => {
  return apiClient.get<ProductReviewStatus>({
    path: `/products/${productId}/review-status`,
    signal,
    errorMessage: 'Failed to load review status',
  });
};

export const createProductReview = async ({
  productId,
  review,
}: CreateProductReviewParams): Promise<
  ApiResponse<CreateProductReviewResponseData>
> => {
  return apiClient.post<CreateProductReviewResponseData, CreateProductReviewData>(
    {
      path: `/products/${productId}/reviews`,
      body: review,
      errorMessage: 'Failed to create review',
    },
  );
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
