import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { ORDER_STATUSES } from '../types/order';

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

export const ordersQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 10, 50),
    status: z.enum(ORDER_STATUSES).optional(),
  })
  .strict();

export const getOrdersSchema = z.object({
  query: ordersQuerySchema,
});

export type OrdersQuery = z.infer<typeof ordersQuerySchema>;

export const orderParamsSchema = z.object({
  params: z
    .object({
      orderId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid order id'),
    })
    .strict(),
});
