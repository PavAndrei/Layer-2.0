import { z } from 'zod';

import {
  PRODUCT_AUDIENCES,
  PRODUCT_IMAGE_ROLES,
  PRODUCT_SIZES,
  PRODUCT_STATUSES,
} from '../../../entities/product';
import type { CreateAdminProductPayload } from '../api';
import type {
  AdminProductFormErrors,
  AdminProductFormValues,
} from './admin-product-form-types';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const uniqueArray = <Value>(values: Value[]) =>
  new Set(values).size === values.length;

const requiredTextField = (
  fieldName: string,
  minimum: number,
  maximum: number,
) =>
  z
    .string()
    .trim()
    .min(minimum, `${fieldName} must be at least ${minimum} characters`)
    .max(maximum, `${fieldName} is too long`);

const slugField = (fieldName: string) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .regex(SLUG_PATTERN, `Invalid ${fieldName}`);

const urlField = (fieldName: string) =>
  z
    .string()
    .trim()
    .url(`${fieldName} must be a valid URL`)
    .max(500, `${fieldName} is too long`);

const optionalUrlField = (fieldName: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || value.length <= 500,
      `${fieldName} is too long`,
    )
    .refine(
      (value) => value === undefined || z.string().url().safeParse(value).success,
      `${fieldName} must be a valid URL`,
    );

const priceField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${fieldName} must be a number`,
    })
    .transform((value) => Number(Number(value).toFixed(2)))
    .refine((value) => value > 0, {
      message: `${fieldName} must be greater than 0`,
    })
    .refine((value) => value <= 100000, {
      message: `${fieldName} is too high`,
    });

const optionalPriceField = (fieldName: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || Number.isFinite(Number(value)),
      `${fieldName} must be a number`,
    )
    .transform((value) =>
      value === undefined ? undefined : Number(Number(value).toFixed(2)),
    )
    .refine((value) => value === undefined || value > 0, {
      message: `${fieldName} must be greater than 0`,
    })
    .refine((value) => value === undefined || value <= 100000, {
      message: `${fieldName} is too high`,
    });

const quantityField = z
  .string()
  .trim()
  .min(1, 'Quantity is required')
  .refine((value) => Number.isInteger(Number(value)), {
    message: 'Quantity must be a whole number',
  })
  .transform((value) => Number(value))
  .refine((value) => value >= 0, {
    message: 'Quantity cannot be negative',
  })
  .refine((value) => value <= 100000, {
    message: 'Quantity is too high',
  });

const skuField = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, 'SKU is too short')
  .max(80, 'SKU is too long')
  .regex(/^[A-Z0-9-]+$/, 'Invalid SKU');

const variantSchema = z
  .object({
    id: z.string(),
    color: slugField('color'),
    image: optionalUrlField('Variant image'),
    quantity: quantityField,
    size: z.enum(PRODUCT_SIZES),
    sku: skuField,
  })
  .strict();

const imageSchema = z
  .object({
    id: z.string(),
    alt: requiredTextField('Image alt text', 3, 180),
    color: z
      .string()
      .trim()
      .toLowerCase()
      .transform((value) => (value ? value : undefined))
      .refine(
        (value) => value === undefined || SLUG_PATTERN.test(value),
        'Invalid image color',
      ),
    role: z.enum(PRODUCT_IMAGE_ROLES),
    src: urlField('Image URL'),
  })
  .strict();

export const adminProductFormSchema = z
  .object({
    audience: z
      .array(z.enum(PRODUCT_AUDIENCES))
      .min(1, 'Select at least one audience')
      .max(PRODUCT_AUDIENCES.length, 'Too many audiences')
      .refine(uniqueArray, 'Audiences must be unique'),
    categories: z
      .array(slugField('category'))
      .min(1, 'Select at least one category')
      .max(12, 'Too many categories')
      .refine(uniqueArray, 'Categories must be unique'),
    defaultPrice: priceField('Default price'),
    description: requiredTextField('Description', 20, 2000),
    discountPrice: optionalPriceField('Discount price'),
    hasDiscount: z.boolean(),
    images: z
      .array(imageSchema)
      .min(1, 'Add at least one product image')
      .max(80, 'Too many images'),
    status: z.enum(PRODUCT_STATUSES),
    title: requiredTextField('Title', 2, 140),
    variants: z
      .array(variantSchema)
      .min(1, 'Add at least one product variant')
      .max(120, 'Too many variants'),
  })
  .strict()
  .superRefine((values, ctx) => {
    const variantSkus = values.variants.map((variant) => variant.sku);

    if (!uniqueArray(variantSkus)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Variant SKUs must be unique',
        path: ['variants'],
      });
    }

    const variantOptions = values.variants.map(
      (variant) => `${variant.size}:${variant.color}`,
    );

    if (!uniqueArray(variantOptions)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Variant size and color combinations must be unique',
        path: ['variants'],
      });
    }

    if (values.hasDiscount) {
      if (values.discountPrice === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount price is required',
          path: ['discountPrice'],
        });
      } else if (values.discountPrice >= values.defaultPrice) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount price must be lower than default price',
          path: ['discountPrice'],
        });
      }
    }

    const variantColors = new Set(
      values.variants.map((variant) => variant.color),
    );
    const invalidImageColorIndex = values.images.findIndex(
      (image) => image.color && !variantColors.has(image.color),
    );

    if (invalidImageColorIndex >= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Image color must match one of the variant colors',
        path: ['images', invalidImageColorIndex, 'color'],
      });
    }
  });

export type AdminProductFormParsedValues = z.infer<
  typeof adminProductFormSchema
>;

export const toCreateAdminProductPayload = (
  values: AdminProductFormParsedValues,
): CreateAdminProductPayload => ({
  audience: values.audience,
  categories: values.categories,
  defaultPrice: values.defaultPrice,
  description: values.description,
  discountPrice: values.hasDiscount ? values.discountPrice : undefined,
  hasDiscount: values.hasDiscount,
  images: values.images.map((image) => ({
    alt: image.alt,
    color: image.color || undefined,
    role: image.role,
    src: image.src,
  })),
  status: values.status,
  title: values.title,
  variants: values.variants.map((variant) => ({
    color: variant.color,
    image: variant.image || undefined,
    quantity: variant.quantity,
    size: variant.size,
    sku: variant.sku,
  })),
});

export const getAdminProductFormErrors = (
  error: z.ZodError,
  values: AdminProductFormValues,
): AdminProductFormErrors => {
  return error.issues.reduce<AdminProductFormErrors>((errors, issue) => {
    const [fieldName, itemIndex, nestedFieldName] = issue.path;

    if (fieldName === 'variants') {
      if (
        typeof itemIndex === 'number' &&
        typeof nestedFieldName === 'string'
      ) {
        const variantId = values.variants[itemIndex]?.id;

        if (!variantId) return errors;

        return {
          ...errors,
          variantItems: {
            ...errors.variantItems,
            [variantId]: {
              ...errors.variantItems?.[variantId],
              [nestedFieldName]: issue.message,
            },
          },
        };
      }

      return {
        ...errors,
        variants: errors.variants ?? issue.message,
      };
    }

    if (fieldName === 'images') {
      if (
        typeof itemIndex === 'number' &&
        typeof nestedFieldName === 'string'
      ) {
        const imageId = values.images[itemIndex]?.id;

        if (!imageId) return errors;

        return {
          ...errors,
          imageItems: {
            ...errors.imageItems,
            [imageId]: {
              ...errors.imageItems?.[imageId],
              [nestedFieldName]: issue.message,
            },
          },
        };
      }

      return {
        ...errors,
        images: errors.images ?? issue.message,
      };
    }

    if (typeof fieldName !== 'string') return errors;

    if (
      fieldName === 'audience' ||
      fieldName === 'categories' ||
      fieldName === 'defaultPrice' ||
      fieldName === 'description' ||
      fieldName === 'discountPrice' ||
      fieldName === 'hasDiscount' ||
      fieldName === 'status' ||
      fieldName === 'title'
    ) {
      return {
        ...errors,
        [fieldName]: errors[fieldName] ?? issue.message,
      };
    }

    return errors;
  }, {});
};
