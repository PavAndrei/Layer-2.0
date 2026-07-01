import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

export const favoriteProductParamsSchema = z.object({
  params: z
    .object({
      productId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid product id'),
    })
    .strict(),
});
