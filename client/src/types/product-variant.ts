export const PRODUCT_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'ONE_SIZE',
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export type ProductVariant = {
  _id: string;
  sku: string;
  size: ProductSize;
  color: string;
  quantity: number;
  image?: string;
};
