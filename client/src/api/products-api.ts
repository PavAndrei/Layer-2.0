import { BASE_API_URL } from '../constants/api';
import type {
  ProductResponse,
  ProductsResponse,
} from '../types/api';

export const getProducts = async (
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${BASE_API_URL}/products?${params.toString()}`,
    { signal },
  );

  const result = (await response.json()) as ProductsResponse;

  if (!response.ok && result.success) {
    return {
      success: false,
      message: 'Failed to load products',
    };
  }

  return result;
};

export const getProductById = async (
  id: string,
  signal?: AbortSignal,
): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_API_URL}/products/${id}`, { signal });

  const result = (await response.json()) as ProductResponse;

  if (!response.ok && result.success) {
    return {
      success: false,
      message: 'Failed to load product',
    };
  }

  return result;
};
