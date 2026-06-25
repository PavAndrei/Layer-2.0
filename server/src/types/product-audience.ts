export const PRODUCT_AUDIENCES = ['men', 'women', 'unisex'] as const;

export type ProductAudience = (typeof PRODUCT_AUDIENCES)[number];
