import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';
import type { ProductCardProps } from '../../../shared/types';

type ProductsResponseData = {
  products: ProductCardProps[];
  pagination: PaginationData;
};

type ProductsResponse = ApiResponse<ProductsResponseData>;

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
