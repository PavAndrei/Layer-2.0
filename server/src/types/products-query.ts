export const PRODUCT_SORT_VALUES = [
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
] as const;

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];

export type ProductsQuery = {
  page: number;
  limit: number;
  searchString?: string;
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSort;
  inStockOnly: boolean;
};
