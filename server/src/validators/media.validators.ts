import { z } from 'zod';

import { MEDIA_UPLOAD_PURPOSES } from '../types/media';

export const createImageKitUploadAuthBodySchema = z
  .object({
    purpose: z.enum(MEDIA_UPLOAD_PURPOSES),
  })
  .strict();

export const createImageKitUploadAuthSchema = z.object({
  body: createImageKitUploadAuthBodySchema,
});

export type CreateImageKitUploadAuthBody = z.infer<
  typeof createImageKitUploadAuthBodySchema
>;
