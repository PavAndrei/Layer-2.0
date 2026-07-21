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

export const adminOrdersQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    userId: optionalObjectIdParam('user id'),
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

export const updateAdminOrderBodySchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    statusNote: clearableTextField({
      fieldName: 'Status note',
      max: 1000,
    }).optional(),
    trackingNumber: clearableTextField({
      fieldName: 'Tracking number',
      max: 120,
    }).optional(),
    adminNote: clearableTextField({
      fieldName: 'Admin note',
      max: 5000,
    }).optional(),
  })
  .strict()
  .refine(
    (body) =>
      hasOwnField(body, 'status') ||
      hasOwnField(body, 'trackingNumber') ||
      hasOwnField(body, 'adminNote'),
    {
      message: 'Order update must contain at least one field',
    },
  )
  .refine(
    (body) => !hasOwnField(body, 'statusNote') || hasOwnField(body, 'status'),
    {
      message: 'Status note requires status update',
    },
  );

export const updateAdminOrderSchema = z.object({
  params: adminOrderParamsSchema.shape.params,
  body: updateAdminOrderBodySchema,
});

export type AdminOrderParams = z.infer<
  typeof adminOrderParamsSchema
>['params'];
export type UpdateAdminOrderBody = z.infer<typeof updateAdminOrderBodySchema>;
