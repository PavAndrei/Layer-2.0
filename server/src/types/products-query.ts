export const PRODUCT_SORT_VALUES = [
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'rating-asc',
  'rating-desc',
] as const;

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];
