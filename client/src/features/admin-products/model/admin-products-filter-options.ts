import {
  CATEGORIES_COLLECTION,
  PRODUCT_AUDIENCES,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_STATUSES,
  type ProductAudience,
  type ProductSize,
  type ProductStatus,
} from '../../../entities/product';
import type { SelectFilterOption } from '../../../shared/ui';
import type {
  AdminProductSortOption,
  AdminProductStockFilter,
} from '../api';

export type { AdminProductSortOption, AdminProductStockFilter } from '../api';

export const ADMIN_PRODUCT_SORT_OPTIONS = [
  'default',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
  'rating-asc',
  'rating-desc',
] as const satisfies readonly AdminProductSortOption[];

export const ADMIN_PRODUCT_STOCK_FILTERS = [
  'in-stock',
  'low-stock',
  'out-of-stock',
] as const satisfies readonly AdminProductStockFilter[];

export type AdminProductStatusFilterValue = ProductStatus | '';
export type AdminProductCategoryFilterValue = string;
export type AdminProductAudienceFilterValue = ProductAudience | '';
export type AdminProductStockFilterValue = AdminProductStockFilter | '';
export type AdminProductDiscountFilterValue = 'discounted' | 'not-discounted' | '';
export type AdminProductColorFilterValue = string;
export type AdminProductSizeFilterValue = ProductSize | '';

export type AdminProductStatusFilterOption =
  SelectFilterOption<AdminProductStatusFilterValue>;
export type AdminProductCategoryFilterOption =
  SelectFilterOption<AdminProductCategoryFilterValue>;
export type AdminProductAudienceFilterOption =
  SelectFilterOption<AdminProductAudienceFilterValue>;
export type AdminProductStockFilterOption =
  SelectFilterOption<AdminProductStockFilterValue>;
export type AdminProductDiscountFilterOption =
  SelectFilterOption<AdminProductDiscountFilterValue>;
export type AdminProductColorFilterOption =
  SelectFilterOption<AdminProductColorFilterValue>;
export type AdminProductSizeFilterOption =
  SelectFilterOption<AdminProductSizeFilterValue>;
export type AdminProductSortFilterOption =
  SelectFilterOption<AdminProductSortOption>;

const statusLabels: Record<ProductStatus, string> = {
  active: 'Active',
  archived: 'Archived',
  draft: 'Draft',
};

const audienceLabels: Record<ProductAudience, string> = {
  men: 'Men',
  unisex: 'Unisex',
  women: 'Women',
};

const stockLabels: Record<AdminProductStockFilter, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
};

export const ADMIN_PRODUCT_STATUS_FILTER_OPTIONS: readonly AdminProductStatusFilterOption[] = [
  { label: 'All statuses', value: '' },
  ...PRODUCT_STATUSES.map((status) => ({
    label: statusLabels[status],
    value: status,
  })),
];

export const ADMIN_PRODUCT_CATEGORY_FILTER_OPTIONS: readonly AdminProductCategoryFilterOption[] = [
  { label: 'All categories', value: '' },
  ...CATEGORIES_COLLECTION,
];

export const ADMIN_PRODUCT_AUDIENCE_FILTER_OPTIONS: readonly AdminProductAudienceFilterOption[] = [
  { label: 'All audiences', value: '' },
  ...PRODUCT_AUDIENCES.map((audience) => ({
    label: audienceLabels[audience],
    value: audience,
  })),
];

export const ADMIN_PRODUCT_STOCK_FILTER_OPTIONS: readonly AdminProductStockFilterOption[] = [
  { label: 'All stock states', value: '' },
  ...ADMIN_PRODUCT_STOCK_FILTERS.map((stock) => ({
    label: stockLabels[stock],
    value: stock,
  })),
];

export const ADMIN_PRODUCT_DISCOUNT_FILTER_OPTIONS: readonly AdminProductDiscountFilterOption[] = [
  { label: 'All discount states', value: '' },
  { label: 'Discounted', value: 'discounted' },
  { label: 'Not discounted', value: 'not-discounted' },
];

export const ADMIN_PRODUCT_COLOR_FILTER_OPTIONS: readonly AdminProductColorFilterOption[] = [
  { label: 'All colors', value: '' },
  ...PRODUCT_COLOR_OPTIONS,
];

export const ADMIN_PRODUCT_SIZE_FILTER_OPTIONS: readonly AdminProductSizeFilterOption[] = [
  { label: 'All sizes', value: '' },
  ...PRODUCT_SIZE_OPTIONS,
];

export const ADMIN_PRODUCT_SORT_FILTER_OPTIONS: readonly AdminProductSortFilterOption[] = [
  { label: 'Default', value: 'default' },
  { label: 'A to Z', value: 'name-asc' },
  { label: 'Z to A', value: 'name-desc' },
  { label: 'Price low to high', value: 'price-asc' },
  { label: 'Price high to low', value: 'price-desc' },
  { label: 'Rating low to high', value: 'rating-asc' },
  { label: 'Rating high to low', value: 'rating-desc' },
];
