import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { Product } from '../../../entities/product';
import type {
  ProductReview,
  ProductReviewsSummary,
} from '../../../entities/review';
import type { PaginationData } from '../../../shared/api';

type ProductResponseData = {
  product: Product;
  relatedProducts: Product[];
};

type ProductResponse = ApiResponse<ProductResponseData>;

type ProductReviewsParams = {
  page: number;
  limit: number;
};

type ProductReviewsResponseData = {
  reviews: ProductReview[];
  summary: ProductReviewsSummary;
  pagination: PaginationData;
};

type ProductReviewsResponse = ApiResponse<ProductReviewsResponseData>;

export const getProductByIdentifier = async (
  identifier: string,
  signal?: AbortSignal,
): Promise<ProductResponse> => {
  return apiClient.get<ProductResponseData>({
    path: `/products/${identifier}`,
    signal,
    errorMessage: 'Failed to load product',
  });
};

export const getProductReviews = async (
  productId: string,
  params: ProductReviewsParams,
  signal?: AbortSignal,
): Promise<ProductReviewsResponse> => {
  return apiClient.get<ProductReviewsResponseData>({
    path: `/products/${productId}/reviews`,
    params,
    signal,
    errorMessage: 'Failed to load product reviews',
  });
};
