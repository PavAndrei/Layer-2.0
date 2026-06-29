import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';
import type { Product } from '../../../entities/product';

type ProductsResponseData = {
  products: Product[];
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
