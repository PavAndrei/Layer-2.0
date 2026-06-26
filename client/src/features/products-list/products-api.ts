import { BASE_API_URL } from '../../shared/api';
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
