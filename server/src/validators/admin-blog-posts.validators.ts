import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { BLOG_POST_STATUSES } from '../types/blog-post';

export const ADMIN_BLOG_POST_SORT_VALUES = [
  'published-asc',
  'published-desc',
  'title-asc',
  'title-desc',
  'updated-asc',
  'updated-desc',
] as const;

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const positiveIntegerParam = (
  name: string,
  defaultValue: number,
  maximum?: number,
) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) return defaultValue;

      const parsedValue = Number(value);

      if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1 ||
        (maximum !== undefined && parsedValue > maximum)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return parsedValue;
    });

const optionalSearchParam = () =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim())
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || value.length <= 120,
      'Search is too long',
    );

const optionalSlugField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_PATTERN, 'Invalid slug')
  .max(180, 'Slug is too long')
  .optional()
  .transform((value) => (value ? value : undefined));

const titleField = z
  .string()
  .trim()
  .min(2, 'Title is too short')
  .max(180, 'Title is too long');

const excerptField = z
  .string()
  .trim()
  .max(360, 'Excerpt is too long')
  .optional()
  .transform((value) => value ?? '');

const contentHtmlField = z
  .string()
  .max(120000, 'Content HTML is too long')
  .optional()
  .transform((value) => value ?? '');

const contentJsonField = z
  .record(z.string(), z.unknown())
  .optional()
  .transform((value) => value ?? {});

const imageUrl = z
  .string()
  .trim()
  .url('Cover image URL must be valid')
  .max(500, 'Cover image URL is too long');

const optionalImageKitFileId = z
  .string()
  .trim()
  .min(1, 'ImageKit file id is required')
  .max(200, 'ImageKit file id is too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid ImageKit file id')
  .optional();

const optionalImageKitFilePath = z
  .string()
  .trim()
  .min(1, 'ImageKit file path is required')
  .max(500, 'ImageKit file path is too long')
  .optional();

const coverImageSchema = z
  .object({
    alt: z
      .string()
      .trim()
      .min(3, 'Cover image alt text is too short')
      .max(180, 'Cover image alt text is too long'),
    fileId: optionalImageKitFileId,
    filePath: optionalImageKitFilePath,
    src: imageUrl,
  })
  .strict();

export const adminBlogPostsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    status: z.enum(BLOG_POST_STATUSES).optional(),
    sort: z
      .union([z.enum(ADMIN_BLOG_POST_SORT_VALUES), z.literal('default')])
      .optional()
      .transform((value) => (value === 'default' ? undefined : value)),
  })
  .strict();

export const getAdminBlogPostsSchema = z.object({
  query: adminBlogPostsQuerySchema,
});

export const adminBlogPostParamsSchema = z.object({
  params: z
    .object({
      blogPostId: z
        .string()
        .refine(isObjectIdOrHexString, 'Invalid blog post id'),
    })
    .strict(),
});

export const createAdminBlogPostBodySchema = z
  .object({
    contentHtml: contentHtmlField,
    contentJson: contentJsonField,
    coverImage: coverImageSchema.nullable().optional(),
    excerpt: excerptField,
    slug: optionalSlugField,
    status: z.enum(BLOG_POST_STATUSES).optional().default('draft'),
    title: titleField,
  })
  .strict();

export const createAdminBlogPostSchema = z.object({
  body: createAdminBlogPostBodySchema,
});

export const updateAdminBlogPostBodySchema = z
  .object({
    contentHtml: contentHtmlField,
    contentJson: contentJsonField,
    coverImage: coverImageSchema.nullable().optional(),
    excerpt: excerptField,
    slug: optionalSlugField,
    status: z.enum(BLOG_POST_STATUSES).optional(),
    title: titleField,
  })
  .strict();

export const updateAdminBlogPostSchema = z.object({
  params: adminBlogPostParamsSchema.shape.params,
  body: updateAdminBlogPostBodySchema,
});

export const updateAdminBlogPostStatusBodySchema = z
  .object({
    status: z.enum(BLOG_POST_STATUSES),
  })
  .strict();

export const updateAdminBlogPostStatusSchema = z.object({
  params: adminBlogPostParamsSchema.shape.params,
  body: updateAdminBlogPostStatusBodySchema,
});

export const deleteAdminBlogPostSchema = z.object({
  params: adminBlogPostParamsSchema.shape.params,
});

export type AdminBlogPostsQuery = z.infer<
  typeof adminBlogPostsQuerySchema
>;
export type AdminBlogPostParams = z.infer<
  typeof adminBlogPostParamsSchema
>['params'];
export type CreateAdminBlogPostBody = z.infer<
  typeof createAdminBlogPostBodySchema
>;
export type UpdateAdminBlogPostBody = z.infer<
  typeof updateAdminBlogPostBodySchema
>;
export type UpdateAdminBlogPostStatusBody = z.infer<
  typeof updateAdminBlogPostStatusBodySchema
>;
