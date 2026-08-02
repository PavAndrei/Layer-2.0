import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { PRODUCT_AUDIENCES } from '../types/product-audience';
import { PRODUCT_IMAGE_ROLES } from '../types/product-image';
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

const uniqueArray = <Value>(values: Value[]) =>
  new Set(values).size === values.length;

const priceValue = (name: string) =>
  z
    .number({
      error: `${name} must be a number`,
    })
    .finite(`${name} must be a valid number`)
    .positive(`${name} must be greater than 0`)
    .max(100000, `${name} is too high`)
    .transform((value) => Number(value.toFixed(2)));

const optionalImageUrl = z
  .string()
  .trim()
  .url('Image URL must be valid')
  .max(500, 'Image URL is too long')
  .optional()
  .transform((value) => (value ? value : undefined));

const imageUrl = z
  .string()
  .trim()
  .url('Image URL must be valid')
  .max(500, 'Image URL is too long');

const optionalImageKitFileId = z
  .string()
  .trim()
  .min(1, 'ImageKit file id is required')
  .max(200, 'ImageKit file id is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid ImageKit file id')
  .optional();

const optionalImageKitFilePath = z
  .string()
  .trim()
  .min(1, 'ImageKit file path is required')
  .max(500, 'ImageKit file path is too long')
  .optional();

const titleField = z
  .string()
  .trim()
  .min(2, 'Title is too short')
  .max(140, 'Title is too long');

const descriptionField = z
  .string()
  .trim()
  .min(20, 'Description is too short')
  .max(2000, 'Description is too long');

const categoryValue = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_PATTERN, 'Invalid category');

const colorValue = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_PATTERN, 'Invalid color');

const skuValue = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, 'SKU is too short')
  .max(80, 'SKU is too long')
  .regex(/^[A-Z0-9-]+$/, 'Invalid SKU');

const createAdminProductVariantSchema = z
  .object({
    sku: skuValue,
    size: z.enum(PRODUCT_SIZES),
    color: colorValue,
    quantity: z
      .number({
        error: 'Quantity must be a number',
      })
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .max(100000, 'Quantity is too high'),
    image: optionalImageUrl,
  })
  .strict();

const createAdminProductImageSchema = z
  .object({
    src: imageUrl,
    alt: z
      .string()
      .trim()
      .min(3, 'Image alt text is too short')
      .max(180, 'Image alt text is too long'),
    fileId: optionalImageKitFileId,
    filePath: optionalImageKitFilePath,
    role: z.enum(PRODUCT_IMAGE_ROLES),
    color: colorValue.optional(),
  })
  .strict();

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

export const adminProductParamsSchema = z.object({
  params: z
    .object({
      productId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid product id'),
    })
    .strict(),
});

export const createAdminProductBodySchema = z
  .object({
    title: titleField,
    description: descriptionField,
    status: z.enum(PRODUCT_STATUSES).optional(),
    defaultPrice: priceValue('Default price'),
    hasDiscount: z.boolean().optional().default(false),
    discountPrice: priceValue('Discount price').optional(),
    categories: z
      .array(categoryValue)
      .min(1, 'Product must have at least one category')
      .max(12, 'Product has too many categories')
      .refine(uniqueArray, 'Product categories must be unique'),
    audience: z
      .array(z.enum(PRODUCT_AUDIENCES))
      .min(1, 'Product must have at least one audience')
      .max(PRODUCT_AUDIENCES.length, 'Product has too many audiences')
      .refine(uniqueArray, 'Product audiences must be unique'),
    variants: z
      .array(createAdminProductVariantSchema)
      .min(1, 'Product must have at least one variant')
      .max(120, 'Product has too many variants'),
    images: z
      .array(createAdminProductImageSchema)
      .min(1, 'Product must have at least one image')
      .max(80, 'Product has too many images'),
  })
  .strict()
  .superRefine((body, ctx) => {
    const variantSkus = body.variants.map((variant) => variant.sku);

    if (!uniqueArray(variantSkus)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Variant SKUs must be unique',
        path: ['variants'],
      });
    }

    const variantOptions = body.variants.map(
      (variant) => `${variant.size}:${variant.color}`,
    );

    if (!uniqueArray(variantOptions)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Variant size and color combinations must be unique',
        path: ['variants'],
      });
    }

    if (body.hasDiscount) {
      if (body.discountPrice === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount price is required when discount is enabled',
          path: ['discountPrice'],
        });
      } else if (body.discountPrice >= body.defaultPrice) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount price must be lower than default price',
          path: ['discountPrice'],
        });
      }
    }

    const variantColors = new Set(
      body.variants.map((variant) => variant.color),
    );
    const invalidImageColorIndex = body.images.findIndex(
      (image) => image.color && !variantColors.has(image.color),
    );

    if (invalidImageColorIndex >= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Image color must match one of the product variant colors',
        path: ['images', invalidImageColorIndex, 'color'],
      });
    }
  });

export const createAdminProductSchema = z.object({
  body: createAdminProductBodySchema,
});

export const updateAdminProductBodySchema = createAdminProductBodySchema;

export const updateAdminProductSchema = z.object({
  params: adminProductParamsSchema.shape.params,
  body: updateAdminProductBodySchema,
});

export const updateAdminProductStatusBodySchema = z
  .object({
    status: z.enum(PRODUCT_STATUSES),
  })
  .strict();

export const updateAdminProductStatusSchema = z.object({
  params: adminProductParamsSchema.shape.params,
  body: updateAdminProductStatusBodySchema,
});

export const deleteAdminProductSchema = z.object({
  params: adminProductParamsSchema.shape.params,
});

export type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>;
export type AdminProductStockFilter =
  (typeof ADMIN_PRODUCT_STOCK_FILTERS)[number];
export type AdminProductParams = z.infer<
  typeof adminProductParamsSchema
>['params'];
export type CreateAdminProductBody = z.infer<
  typeof createAdminProductBodySchema
>;
export type UpdateAdminProductBody = z.infer<
  typeof updateAdminProductBodySchema
>;
export type UpdateAdminProductStatusBody = z.infer<
  typeof updateAdminProductStatusBodySchema
>;
