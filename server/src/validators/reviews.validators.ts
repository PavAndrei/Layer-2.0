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

export type ProductReviewsParams = z.infer<typeof productReviewsParamsSchema>;
export type ProductReviewsQuery = z.infer<typeof productReviewsQuerySchema>;
