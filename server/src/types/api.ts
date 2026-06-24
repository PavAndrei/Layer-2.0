import type { ProductVariant } from './product-variant';

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ProductDto = {
  _id: string;
  img: string;
  title: string;
  description: string;
  defaultPrice: number;
  discountPrice: number;
  discountPercent: number;
  rating: number;
  categories: string[];
  hasDiscount: boolean;
  isNewProduct: boolean;
  variants: ProductVariant[];
  totalQuantity: number;
};

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsResponse = ApiSuccess<{
  products: ProductDto[];
  pagination: PaginationData;
}>;

export type ProductResponse = ApiSuccess<{
  product: ProductDto;
  relatedProducts: ProductDto[];
}>;
