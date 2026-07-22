import { z } from 'zod';

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

export type UpdateAdminGeneralSettingsBody = z.infer<
  typeof updateAdminGeneralSettingsBodySchema
>;
