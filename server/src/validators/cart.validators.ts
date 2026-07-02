import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

export const validateCartSchema = z.object({
  body: z
    .object({
      items: z
        .array(
          z
            .object({
              productId: z
                .string()
                .refine(isObjectIdOrHexString, 'Invalid product id'),
              quantity: z
                .number()
                .int('Invalid quantity')
                .min(1, 'Invalid quantity')
                .max(99, 'Invalid quantity'),
              variantId: z
                .string()
                .refine(isObjectIdOrHexString, 'Invalid variant id'),
            })
            .strict(),
        )
        .max(100, 'Cart contains too many items'),
    })
    .strict(),
});

export type ValidateCartBody = z.infer<typeof validateCartSchema>['body'];
