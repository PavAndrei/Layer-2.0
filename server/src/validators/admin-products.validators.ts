import { z } from 'zod';

import { PRODUCT_AUDIENCES } from '../types/product-audience';
import { PRODUCT_STATUSES } from '../types/product-status';
import { PRODUCT_SIZES } from '../types/product-variant';
import { PRODUCT_SORT_VALUES } from '../types/products-query';

export const ADMIN_PRODUCT_STOCK_FILTERS = [
  'in-stock',
  'low-stock',
  'out-of-stock',
] as const;

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const positiveIntegerParam = (
  name: string,
  defaultValue: number,
  maximum?: number,
) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) return defaultValue;

      const parsedValue = Number(value);

      if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1 ||
        (maximum !== undefined && parsedValue > maximum)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return parsedValue;
    });

const optionalSearchParam = () =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim())
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || value.length <= 120,
      'Search is too long',
    );

const optionalBooleanParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === '') return undefined;

      if (value !== 'true' && value !== 'false') {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return value === 'true';
    });

const optionalSlugParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim().toLowerCase())
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || SLUG_PATTERN.test(value),
      `Invalid ${name}`,
    );

export const adminProductsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    status: z.enum(PRODUCT_STATUSES).optional(),
    category: optionalSlugParam('category'),
    audience: z.enum(PRODUCT_AUDIENCES).optional(),
    stock: z.enum(ADMIN_PRODUCT_STOCK_FILTERS).optional(),
    hasDiscount: optionalBooleanParam('discount'),
    color: optionalSlugParam('color'),
    size: z.enum(PRODUCT_SIZES).optional(),
    sort: z
      .union([z.enum(PRODUCT_SORT_VALUES), z.literal('default')])
      .optional()
      .transform((value) => (value === 'default' ? undefined : value)),
  })
  .strict();

export const getAdminProductsSchema = z.object({
  query: adminProductsQuerySchema,
});

export type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>;
export type AdminProductStockFilter =
  (typeof ADMIN_PRODUCT_STOCK_FILTERS)[number];
