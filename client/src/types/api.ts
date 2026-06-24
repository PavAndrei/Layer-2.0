import type { ProductCardProps } from './product';

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsResponseData = {
  products: ProductCardProps[];
  pagination: PaginationData;
};

export type ProductResponseData = {
  product: ProductCardProps;
  relatedProducts: ProductCardProps[];
};

export type ProductsResponse = ApiResponse<ProductsResponseData>;

export type ProductResponse = ApiResponse<ProductResponseData>;
