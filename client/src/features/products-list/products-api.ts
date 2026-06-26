import { apiClient } from '../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../shared/api';
import type { ProductCardProps } from '../../shared/types';

type ProductsResponseData = {
  products: ProductCardProps[];
  pagination: PaginationData;
};

type ProductResponseData = {
  product: ProductCardProps;
  relatedProducts: ProductCardProps[];
};

type ProductsResponse = ApiResponse<ProductsResponseData>;

type ProductResponse = ApiResponse<ProductResponseData>;

export const getProducts = async (
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  return apiClient.get<ProductsResponseData>({
    path: '/products',
    params,
    signal,
    errorMessage: 'Failed to load products',
  });
};

export const getProductById = async (
  id: string,
  signal?: AbortSignal,
): Promise<ProductResponse> => {
  return apiClient.get<ProductResponseData>({
    path: `/products/${id}`,
    signal,
    errorMessage: 'Failed to load product',
  });
};
