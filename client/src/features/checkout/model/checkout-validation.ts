import { z } from 'zod';

import type {
  CheckoutFormErrors,
  CheckoutFormValues,
} from './checkout-types';

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email')
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

export const checkoutSchema = z.object({
  contactEmail: emailSchema,
  shippingAddress: z
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
    .strict(),
});

export const getCheckoutFieldErrors = (
  error: z.ZodError<CheckoutFormValues>,
): CheckoutFormErrors => {
  return error.issues.reduce<CheckoutFormErrors>((errors, issue) => {
    const [fieldName, nestedFieldName] = issue.path;

    if (fieldName === 'contactEmail' && !errors.contactEmail) {
      return {
        ...errors,
        contactEmail: issue.message,
      };
    }

    if (
      fieldName === 'shippingAddress' &&
      typeof nestedFieldName === 'string' &&
      !errors.shippingAddress?.[nestedFieldName as keyof CheckoutFormValues['shippingAddress']]
    ) {
      return {
        ...errors,
        shippingAddress: {
          ...errors.shippingAddress,
          [nestedFieldName]: issue.message,
        },
      };
    }

    return errors;
  }, {});
};
