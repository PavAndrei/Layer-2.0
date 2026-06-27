export const PRODUCT_IMAGE_ROLES = [
  'main',
  'front',
  'back',
  'side',
  'detail',
  'model',
  'fabric',
] as const;

export type ProductImageRole = (typeof PRODUCT_IMAGE_ROLES)[number];

export type ProductImage = {
  src: string;
  alt: string;
  role: ProductImageRole;
  color?: string;
};

