export const PRODUCT_STATUSES = ['active', 'draft', 'archived'] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
