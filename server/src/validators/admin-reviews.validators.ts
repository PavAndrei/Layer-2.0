import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { REVIEW_STATUSES } from '../types/review';

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

const optionalObjectIdParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim())
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || isObjectIdOrHexString(value),
      `Invalid ${name}`,
    );

const optionalRatingParam = () =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === '') return undefined;

      const parsedValue = Number(value);

      if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1 ||
        parsedValue > 5
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid rating',
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

const optionalDateParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === '') return undefined;

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return date;
    });

const clearableTextField = ({
  fieldName,
  max,
}: {
  fieldName: string;
  max: number;
}) =>
  z
    .string()
    .trim()
    .max(max, `${fieldName} is too long`)
    .transform((value) => (value ? value : undefined));

const hasOwnField = <Field extends string>(
  value: Record<string, unknown>,
  field: Field,
) => Object.prototype.hasOwnProperty.call(value, field);

export const adminReviewsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    status: z.enum(REVIEW_STATUSES).optional(),
    rating: optionalRatingParam(),
    productId: optionalObjectIdParam('product id'),
    verifiedPurchase: optionalBooleanParam('verified purchase'),
    dateFrom: optionalDateParam('date from'),
    dateTo: optionalDateParam('date to'),
  })
  .strict()
  .refine(
    (query) =>
      !query.dateFrom ||
      !query.dateTo ||
      query.dateFrom.getTime() <= query.dateTo.getTime(),
    {
      message: 'Date from must be before date to',
    },
  );

export const getAdminReviewsSchema = z.object({
  query: adminReviewsQuerySchema,
});

export const adminReviewParamsSchema = z.object({
  params: z
    .object({
      reviewId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid review id'),
    })
    .strict(),
});

export const updateAdminReviewBodySchema = z
  .object({
    status: z.enum(REVIEW_STATUSES).optional(),
    moderationReason: clearableTextField({
      fieldName: 'Moderation reason',
      max: 1000,
    }).optional(),
  })
  .strict()
  .refine(
    (body) =>
      hasOwnField(body, 'status') ||
      hasOwnField(body, 'moderationReason'),
    {
      message: 'Review update must contain at least one field',
    },
  );

export const updateAdminReviewSchema = z.object({
  params: adminReviewParamsSchema.shape.params,
  body: updateAdminReviewBodySchema,
});

export const deleteAdminReviewSchema = z.object({
  params: adminReviewParamsSchema.shape.params,
});

export type AdminReviewsQuery = z.infer<typeof adminReviewsQuerySchema>;
export type AdminReviewParams = z.infer<
  typeof adminReviewParamsSchema
>['params'];
export type UpdateAdminReviewBody = z.infer<
  typeof updateAdminReviewBodySchema
>;
