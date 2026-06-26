import type { ProductAudience } from './product-audience';
import type { ProductSize } from './product-variant';

export const PRODUCT_SORT_VALUES = [
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'rating-asc',
  'rating-desc',
] as const;

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];

export type ProductsQuery = {
  page: number;
  limit: number;
  searchString?: string;
  audience: ProductAudience[];
  categories: string[];
  sizes: ProductSize[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSort;
  inStockOnly: boolean;
  hasDiscount: boolean;
  isNewProduct: boolean;
};
