import { z } from 'zod';

import { cartItemsSchema } from './cart.validators';

const emailSchema = z
  .string()
  .trim()
  .email('Invalid email')
  .max(254, 'Email is too long')
  .transform((email) => email.toLowerCase());

const requiredString = (name: string, maximum: number) =>
  z
    .string()
    .trim()
    .min(1, `${name} is required`)
    .max(maximum, `${name} is too long`);

const optionalString = (name: string, maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `${name} is too long`)
    .optional()
    .transform((value) => value || undefined);

const shippingAddressSchema = z
  .object({
    firstName: requiredString('First name', 80),
    lastName: requiredString('Last name', 80),
    addressLine1: requiredString('Address line 1', 160),
    addressLine2: optionalString('Address line 2', 160),
    city: requiredString('City', 120),
    region: optionalString('Region', 120),
    postalCode: requiredString('Postal code', 40),
    country: requiredString('Country', 80).transform((country) =>
      country.toUpperCase(),
    ),
    phone: optionalString('Phone', 40),
  })
  .strict();

export const checkoutSchema = z.object({
  body: z
    .object({
      contactEmail: emailSchema,
      items: cartItemsSchema.min(1, 'Cart must contain at least one item'),
      shippingAddress: shippingAddressSchema,
    })
    .strict(),
});

export type CheckoutBody = z.infer<typeof checkoutSchema>['body'];
