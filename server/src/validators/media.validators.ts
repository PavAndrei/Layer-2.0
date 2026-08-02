import { z } from 'zod';

import { MEDIA_UPLOAD_PURPOSES } from '../types/media';

export const createImageKitUploadAuthBodySchema = z
  .object({
    purpose: z.enum(MEDIA_UPLOAD_PURPOSES),
  })
  .strict();

const imageKitFileId = z
  .string()
  .trim()
  .min(1, 'ImageKit file id is required')
  .max(200, 'ImageKit file id is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid ImageKit file id');

const imageKitFilePath = z
  .string()
  .trim()
  .min(1, 'ImageKit file path is required')
  .max(500, 'ImageKit file path is too long');

const imageKitImageUrl = z
  .string()
  .trim()
  .url('Image URL must be valid')
  .max(2048, 'Image URL is too long');

export const createImageKitUploadAuthSchema = z.object({
  body: createImageKitUploadAuthBodySchema,
});

export const createMediaAssetBodySchema = z
  .object({
    fileId: imageKitFileId,
    filePath: imageKitFilePath,
    fileType: z
      .string()
      .trim()
      .min(1, 'File type is required')
      .max(80, 'File type is too long'),
    height: z.number().int().min(0).optional(),
    name: z
      .string()
      .trim()
      .min(1, 'File name is required')
      .max(300, 'File name is too long'),
    purpose: z.enum(MEDIA_UPLOAD_PURPOSES),
    size: z.number().int().min(0),
    thumbnailUrl: imageKitImageUrl.optional(),
    url: imageKitImageUrl,
    width: z.number().int().min(0).optional(),
  })
  .strict();

export const createMediaAssetSchema = z.object({
  body: createMediaAssetBodySchema,
});

export const imageKitFileParamsSchema = z.object({
  params: z
    .object({
      fileId: imageKitFileId,
    })
    .strict(),
});

export type CreateImageKitUploadAuthBody = z.infer<
  typeof createImageKitUploadAuthBodySchema
>;
export type CreateMediaAssetBody = z.infer<
  typeof createMediaAssetBodySchema
>;
export type ImageKitFileParams = z.infer<
  typeof imageKitFileParamsSchema
>['params'];
