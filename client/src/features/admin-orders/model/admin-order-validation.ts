import { z } from 'zod';

import { ORDER_STATUSES } from '../../../entities/order';

const clearableString = (name: string, maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `${name} is too long`);

export const updateAdminOrderSchema = z
  .object({
    adminNote: clearableString('Admin note', 5000).optional(),
    status: z.enum(ORDER_STATUSES).optional(),
    statusNote: clearableString('Status note', 1000).optional(),
    trackingNumber: clearableString('Tracking number', 120).optional(),
  })
  .strict();

export const adminOrderManagementFormSchema = z
  .object({
    adminNote: clearableString('Admin note', 5000),
    status: z.enum(ORDER_STATUSES),
    statusNote: clearableString('Status note', 1000),
    trackingNumber: clearableString('Tracking number', 120),
  })
  .strict();

export type UpdateAdminOrderPayload = z.infer<typeof updateAdminOrderSchema>;
export type AdminOrderManagementFormValues = z.infer<
  typeof adminOrderManagementFormSchema
>;
