import type {
  AdminReview,
  AdminReviewListItem,
  ReviewStatus,
  UpdateAdminReviewData,
} from '../../../entities/review';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type AdminReviewsParams = {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  page?: number;
  productId?: string;
  rating?: number;
  status?: ReviewStatus;
  verifiedPurchase?: boolean;
};

export type AdminReviewsResponseData = {
  pagination: PaginationData;
  reviews: AdminReviewListItem[];
};

export type AdminReviewResponseData = {
  review: AdminReview;
};

export type UpdateAdminReviewParams = {
  payload: UpdateAdminReviewData;
  reviewId: string;
};

export type DeleteAdminReviewResponseData = {
  productId: string;
  reviewId: string;
};

export const getAdminReviews = async (
  params: AdminReviewsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminReviewsResponseData>> => {
  return apiClient.get<AdminReviewsResponseData>({
    path: '/admin/reviews',
    params,
    signal,
    errorMessage: 'Failed to load admin reviews',
  });
};

export const getAdminReview = async (
  reviewId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminReviewResponseData>> => {
  return apiClient.get<AdminReviewResponseData>({
    path: `/admin/reviews/${reviewId}`,
    signal,
    errorMessage: 'Failed to load admin review',
  });
};

export const updateAdminReview = async ({
  payload,
  reviewId,
}: UpdateAdminReviewParams): Promise<ApiResponse<AdminReviewResponseData>> => {
  return apiClient.patch<AdminReviewResponseData, UpdateAdminReviewData>({
    path: `/admin/reviews/${reviewId}`,
    body: payload,
    errorMessage: 'Failed to update admin review',
  });
};

export const deleteAdminReview = async (
  reviewId: string,
): Promise<ApiResponse<DeleteAdminReviewResponseData>> => {
  return apiClient.delete<DeleteAdminReviewResponseData>({
    path: `/admin/reviews/${reviewId}`,
    errorMessage: 'Failed to delete admin review',
  });
};
