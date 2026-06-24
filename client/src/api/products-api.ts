import { BASE_API_URL } from '../constants/api';
import type {
  ApiErrorResponse,
  ProductResponse,
  ProductsResponse,
} from '../types/api';
import type { ProductCardProps } from '../types/product';

type ProductsApiSuccess = {
  success: true;
  message: string;
  products: ProductCardProps[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ProductApiSuccess = {
  success: true;
  message: string;
  product: ProductCardProps;
  relatedProducts: ProductCardProps[];
};

export const getProducts = async (
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${BASE_API_URL}/products?${params.toString()}`,
    { signal },
  );

  const result = (await response.json()) as
    | ProductsApiSuccess
    | ApiErrorResponse;

  if (!response.ok || !result.success) {
    return {
      success: false,
      message: result.message || 'Failed to load products',
    };
  }

  return {
    success: true,
    message: result.message,
    data: {
      products: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    },
  };
};

export const getProductById = async (
  id: string,
  signal?: AbortSignal,
): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_API_URL}/products/${id}`, { signal });

  const result = (await response.json()) as ProductApiSuccess | ApiErrorResponse;

  if (!response.ok || !result.success) {
    return {
      success: false,
      message: result.message || 'Failed to load product',
    };
  }

  return {
    success: true,
    message: result.message,
    data: {
      product: result.product,
      relatedProducts: result.relatedProducts,
    },
  };
};
