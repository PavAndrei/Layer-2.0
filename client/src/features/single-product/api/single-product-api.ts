import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { ProductCardProps } from '../../../entities/product';

type ProductResponseData = {
  product: ProductCardProps;
  relatedProducts: ProductCardProps[];
};

type ProductResponse = ApiResponse<ProductResponseData>;

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
