import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import {
  ORDER_PAYMENT_STATUSES,
  ORDER_STATUSES,
} from '../types/order';

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

export const adminOrdersQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    status: z.enum(ORDER_STATUSES).optional(),
    paymentStatus: z.enum(ORDER_PAYMENT_STATUSES).optional(),
  })
  .strict();

export const getAdminOrdersSchema = z.object({
  query: adminOrdersQuerySchema,
});

export type AdminOrdersQuery = z.infer<
  typeof adminOrdersQuerySchema
>;

export const adminOrderParamsSchema = z.object({
  params: z
    .object({
      orderId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid order id'),
    })
    .strict(),
});
