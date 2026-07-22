import { z } from 'zod';

import { STORE_SHIPPING_REGIONS } from '../types/store-settings';

const requiredTextField = ({
  fieldName,
  max,
  min = 1,
}: {
  fieldName: string;
  max: number;
  min?: number;
}) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} is required`)
    .max(max, `${fieldName} is too long`);

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

const requiredLongTextField = ({
  fieldName,
  max,
  min,
}: {
  fieldName: string;
  max: number;
  min: number;
}) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters`)
    .max(max, `${fieldName} is too long`);

const nonNegativeNumberField = (fieldName: string) =>
  z
    .number({ error: `${fieldName} must be a number` })
    .finite(`${fieldName} must be a finite number`)
    .min(0, `${fieldName} cannot be negative`);

const positiveIntegerField = (fieldName: string) =>
  z
    .number({ error: `${fieldName} must be a number` })
    .int(`${fieldName} must be a whole number`)
    .min(1, `${fieldName} must be at least 1`);

export const updateAdminGeneralSettingsBodySchema = z
  .object({
    address: clearableTextField({
      fieldName: 'Address',
      max: 300,
    }).optional(),
    storeName: requiredTextField({
      fieldName: 'Store name',
      max: 80,
      min: 2,
    }).optional(),
    supportEmail: requiredTextField({
      fieldName: 'Support email',
      max: 254,
    }).email('Invalid support email').optional(),
    supportPhone: clearableTextField({
      fieldName: 'Support phone',
      max: 40,
    }).optional(),
  })
  .strict()
  .refine(
    (body) =>
      Object.hasOwn(body, 'address') ||
      Object.hasOwn(body, 'storeName') ||
      Object.hasOwn(body, 'supportEmail') ||
      Object.hasOwn(body, 'supportPhone'),
    {
      message: 'General settings update must contain at least one field',
    },
  );

export const updateAdminGeneralSettingsSchema = z.object({
  body: updateAdminGeneralSettingsBodySchema,
});

export const updateAdminShippingSettingsBodySchema = z
  .object({
    estimatedDeliveryDaysMax: positiveIntegerField(
      'Estimated delivery max days',
    ).optional(),
    estimatedDeliveryDaysMin: positiveIntegerField(
      'Estimated delivery min days',
    ).optional(),
    freeShippingEnabled: z.boolean().optional(),
    freeShippingThreshold: nonNegativeNumberField(
      'Free shipping threshold',
    ).nullable().optional(),
    shippingNotice: requiredLongTextField({
      fieldName: 'Shipping notice',
      max: 300,
      min: 20,
    }).optional(),
    shippingRegion: z.enum(STORE_SHIPPING_REGIONS).optional(),
    standardShippingPrice: nonNegativeNumberField(
      'Standard shipping price',
    ).optional(),
  })
  .strict()
  .refine(
    (body) =>
      Object.hasOwn(body, 'estimatedDeliveryDaysMax') ||
      Object.hasOwn(body, 'estimatedDeliveryDaysMin') ||
      Object.hasOwn(body, 'freeShippingEnabled') ||
      Object.hasOwn(body, 'freeShippingThreshold') ||
      Object.hasOwn(body, 'shippingNotice') ||
      Object.hasOwn(body, 'shippingRegion') ||
      Object.hasOwn(body, 'standardShippingPrice'),
    {
      message: 'Shipping settings update must contain at least one field',
    },
  )
  .refine(
    (body) => {
      if (
        body.estimatedDeliveryDaysMin === undefined ||
        body.estimatedDeliveryDaysMax === undefined
      ) {
        return true;
      }

      return body.estimatedDeliveryDaysMax >= body.estimatedDeliveryDaysMin;
    },
    {
      message: 'Estimated delivery max days must be greater than or equal to min days',
      path: ['estimatedDeliveryDaysMax'],
    },
  )
  .refine(
    (body) =>
      body.freeShippingEnabled !== true ||
      body.freeShippingThreshold !== null,
    {
      message: 'Free shipping threshold is required when free shipping is enabled',
      path: ['freeShippingThreshold'],
    },
  );

export const updateAdminShippingSettingsSchema = z.object({
  body: updateAdminShippingSettingsBodySchema,
});

export type UpdateAdminGeneralSettingsBody = z.infer<
  typeof updateAdminGeneralSettingsBodySchema
>;
export type UpdateAdminShippingSettingsBody = z.infer<
  typeof updateAdminShippingSettingsBodySchema
>;
