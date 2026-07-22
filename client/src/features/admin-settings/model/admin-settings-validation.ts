import { z } from 'zod';

import { STORE_SHIPPING_REGIONS } from '../../../entities/store-settings';
import { getZodFieldErrors } from '../../../shared/lib';
import type {
  AdminGeneralSettingsFormValues,
  AdminShippingSettingsFormValues,
} from './admin-settings-types';

const requiredTextField = (
  fieldName: string,
  maximum: number,
  minimum = 1,
) =>
  z
    .string()
    .trim()
    .min(minimum, `${fieldName} is required`)
    .max(maximum, `${fieldName} is too long`);

const optionalTextField = (fieldName: string, maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `${fieldName} is too long`);

const requiredTextAreaField = (
  fieldName: string,
  minimum: number,
  maximum: number,
) =>
  z
    .string()
    .trim()
    .min(minimum, `${fieldName} must be at least ${minimum} characters`)
    .max(maximum, `${fieldName} is too long`);

export const adminGeneralSettingsSchema = z.object({
  address: optionalTextField('Address', 300),
  storeName: requiredTextField('Store name', 80, 2),
  supportEmail: requiredTextField('Support email', 254)
    .email('Enter a valid support email')
    .transform((email) => email.toLowerCase()),
  supportPhone: optionalTextField('Support phone', 40),
});

export const getAdminGeneralSettingsFieldErrors = (
  error: z.ZodError<AdminGeneralSettingsFormValues>,
) => getZodFieldErrors<AdminGeneralSettingsFormValues>(error);

const numericTextField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${fieldName} must be a number`,
    });

const nonNegativeNumericTextField = (fieldName: string) =>
  numericTextField(fieldName).refine((value) => Number(value) >= 0, {
    message: `${fieldName} cannot be negative`,
  });

const positiveIntegerTextField = (fieldName: string) =>
  numericTextField(fieldName)
    .refine((value) => Number.isInteger(Number(value)), {
      message: `${fieldName} must be a whole number`,
    })
    .refine((value) => Number(value) >= 1, {
      message: `${fieldName} must be at least 1`,
    });

export const adminShippingSettingsSchema = z
  .object({
    estimatedDeliveryDaysMax: positiveIntegerTextField(
      'Estimated delivery max days',
    ),
    estimatedDeliveryDaysMin: positiveIntegerTextField(
      'Estimated delivery min days',
    ),
    freeShippingEnabled: z.boolean(),
    freeShippingThreshold: z.string().trim(),
    shippingNotice: requiredTextAreaField('Shipping notice', 20, 300),
    shippingRegion: z.enum(STORE_SHIPPING_REGIONS),
    standardShippingPrice: nonNegativeNumericTextField(
      'Standard shipping price',
    ),
  })
  .refine(
    (values) =>
      Number(values.estimatedDeliveryDaysMax) >=
      Number(values.estimatedDeliveryDaysMin),
    {
      message: 'Estimated delivery max days must be greater than or equal to min days',
      path: ['estimatedDeliveryDaysMax'],
    },
  )
  .refine(
    (values) =>
      !values.freeShippingEnabled ||
      values.freeShippingThreshold.length > 0,
    {
      message: 'Free shipping threshold is required',
      path: ['freeShippingThreshold'],
    },
  )
  .refine(
    (values) =>
      !values.freeShippingEnabled ||
      Number.isFinite(Number(values.freeShippingThreshold)),
    {
      message: 'Free shipping threshold must be a number',
      path: ['freeShippingThreshold'],
    },
  )
  .refine(
    (values) =>
      !values.freeShippingEnabled ||
      Number(values.freeShippingThreshold) >= 0,
    {
      message: 'Free shipping threshold cannot be negative',
      path: ['freeShippingThreshold'],
    },
  );

export const getAdminShippingSettingsFieldErrors = (
  error: z.ZodError<AdminShippingSettingsFormValues>,
) => getZodFieldErrors<AdminShippingSettingsFormValues>(error);
