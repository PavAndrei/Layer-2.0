import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { PRODUCT_AUDIENCES } from '../types/product-audience';
import { PRODUCT_SORT_VALUES } from '../types/products-query';
import { PRODUCT_SIZES } from '../types/product-variant';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const optionalStringParam = () =>
  z.string().optional().transform((value) => value?.trim());

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

const priceParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) return undefined;

      const parsedValue = Number(value);

      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return parsedValue;
    });

const booleanParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === 'false') return false;
      if (value === 'true') return true;

      ctx.addIssue({
        code: 'custom',
        message: `Invalid ${name}`,
      });

      return z.NEVER;
    });

const csvStringArrayParam = ({
  maximum,
  name,
  pattern,
}: {
  maximum: number;
  name: string;
  pattern: RegExp;
}) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (!value) return [];

      const values = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (
        values.length > maximum ||
        values.some((item) => !pattern.test(item))
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return [...new Set(values)];
    });

const csvEnumArrayParam = <Value extends string>({
  allowedValues,
  name,
}: {
  allowedValues: readonly Value[];
  name: string;
}) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (!value) return [];

      const values = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (
        values.length > allowedValues.length ||
        values.some(
          (item) =>
            !allowedValues.some((allowedValue) => allowedValue === item),
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return [...new Set(values)] as Value[];
    });

export const productsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    searchString: optionalStringParam()
      .transform((value) => value || undefined)
      .refine(
        (value) => value === undefined || value.length <= 100,
        'Search string is too long',
      ),
    audience: csvEnumArrayParam({
      allowedValues: PRODUCT_AUDIENCES,
      name: 'audience',
    }),
    categories: csvStringArrayParam({
      maximum: 20,
      name: 'categories',
      pattern: SLUG_PATTERN,
    }),
    sizes: csvEnumArrayParam({
      allowedValues: PRODUCT_SIZES,
      name: 'sizes',
    }),
    colors: csvStringArrayParam({
      maximum: 20,
      name: 'colors',
      pattern: SLUG_PATTERN,
    }),
    minPrice: priceParam('minPrice'),
    maxPrice: priceParam('maxPrice'),
    sortBy: z
      .union([z.enum(PRODUCT_SORT_VALUES), z.literal('default')])
      .optional()
      .transform((value) => (value === 'default' ? undefined : value)),
    inStockOnly: booleanParam('inStockOnly'),
    hasDiscount: booleanParam('hasDiscount'),
    isNewProduct: booleanParam('isNewProduct'),
  })
  .strict()
  .superRefine((query, ctx) => {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'minPrice cannot exceed maxPrice',
        path: ['minPrice'],
      });
    }
  });

export const getProductsSchema = z.object({
  query: productsQuerySchema,
});

export type ProductsQuery = z.infer<typeof productsQuerySchema>;

export const productParamsSchema = z.object({
  params: z
    .object({
      identifier: z
        .string()
        .trim()
        .min(1, 'Product identifier is required')
        .max(140, 'Product identifier is too long')
        .refine(
          (value) => isObjectIdOrHexString(value) || SLUG_PATTERN.test(value),
          'Invalid product identifier',
        ),
    })
    .strict(),
});
