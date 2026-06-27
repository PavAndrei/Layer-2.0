import type { ProductVariant } from './product-variant';
import type { ProductAudience } from './product-audience';
import type { ProductImage } from './product-image';

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
  audience: ProductAudience[];
  hasDiscount: boolean;
  isNewProduct: boolean;
  images: ProductImage[];
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
