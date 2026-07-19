import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { Product } from '../../../entities/product';

type ProductResponseData = {
  product: Product;
  relatedProducts: Product[];
};

type ProductResponse = ApiResponse<ProductResponseData>;

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
