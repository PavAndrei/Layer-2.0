import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

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

      if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return maximum ? Math.min(parsedValue, maximum) : parsedValue;
    });

export const userReviewsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 10, 50),
  })
  .strict();

export const getUserReviewsSchema = z.object({
  query: userReviewsQuerySchema,
});

export const productReviewsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 5, 20),
  })
  .strict();

export const productReviewsParamsSchema = z
  .object({
    productId: z
      .string()
      .refine(isObjectIdOrHexString, 'Invalid product id'),
  })
  .strict();

export const productReviewsSchema = z.object({
  params: productReviewsParamsSchema,
  query: productReviewsQuerySchema,
});

export const productReviewStatusSchema = z.object({
  params: productReviewsParamsSchema,
});

export const createProductReviewSchema = z.object({
  params: productReviewsParamsSchema,
  body: z
    .object({
      rating: z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
      title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(120, 'Title is too long'),
      text: z
        .string()
        .trim()
        .min(1, 'Review text is required')
        .max(2000, 'Review text is too long'),
    })
    .strict(),
});

export type ProductReviewsParams = z.infer<typeof productReviewsParamsSchema>;
export type ProductReviewsQuery = z.infer<typeof productReviewsQuerySchema>;
export type UserReviewsQuery = z.infer<typeof userReviewsQuerySchema>;
export type CreateProductReviewBody = z.infer<
  typeof createProductReviewSchema
>['body'];
