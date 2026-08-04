import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const TAG_PATTERN = /^[a-z0-9-]+$/;

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

export const blogPostsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 9, 50),
    search: z
      .string()
      .optional()
      .transform((value) => value?.trim() || undefined)
      .refine(
        (value) => value === undefined || value.length <= 100,
        'Search is too long',
      ),
    tag: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .transform((value) => value || undefined)
      .refine(
        (value) => value === undefined || TAG_PATTERN.test(value),
        'Invalid tag',
      )
      .refine(
        (value) => value === undefined || value.length <= 40,
        'Tag is too long',
      ),
  })
  .strict();

export const getBlogPostsSchema = z.object({
  query: blogPostsQuerySchema,
});

export const blogPostParamsSchema = z.object({
  params: z
    .object({
      slug: z
        .string()
        .trim()
        .min(1, 'Blog post slug is required')
        .max(140, 'Blog post slug is too long')
        .refine((value) => SLUG_PATTERN.test(value), 'Invalid blog post slug'),
    })
    .strict(),
});

const setBlogPostLikeBodySchema = z
  .object({
    liked: z.boolean(),
  })
  .strict();

export const setBlogPostLikeSchema = z.object({
  params: blogPostParamsSchema.shape.params,
  body: setBlogPostLikeBodySchema,
});

const blogPostCommentIdSchema = z
  .string()
  .refine(isObjectIdOrHexString, 'Invalid comment id');

export const blogPostCommentsQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 10, 50),
  })
  .strict();

export const blogPostCommentParamsSchema = z.object({
  params: blogPostParamsSchema.shape.params
    .extend({
      commentId: blogPostCommentIdSchema,
    })
    .strict(),
});

export const getBlogPostCommentsSchema = z.object({
  params: blogPostParamsSchema.shape.params,
  query: blogPostCommentsQuerySchema,
});

export const createBlogPostCommentSchema = z.object({
  params: blogPostParamsSchema.shape.params,
  body: z
    .object({
      parentCommentId: blogPostCommentIdSchema.nullable().optional(),
      text: z
        .string()
        .trim()
        .min(1, 'Comment text is required')
        .max(2000, 'Comment text is too long'),
    })
    .strict(),
});

export const updateBlogPostCommentSchema = z.object({
  params: blogPostCommentParamsSchema.shape.params,
  body: z
    .object({
      text: z
        .string()
        .trim()
        .min(1, 'Comment text is required')
        .max(2000, 'Comment text is too long'),
    })
    .strict(),
});

export const deleteBlogPostCommentSchema = z.object({
  params: blogPostCommentParamsSchema.shape.params,
});

export type BlogPostsQuery = z.infer<typeof blogPostsQuerySchema>;
export type BlogPostParams = z.infer<typeof blogPostParamsSchema>['params'];
export type SetBlogPostLikeBody = z.infer<typeof setBlogPostLikeBodySchema>;
export type BlogPostCommentsQuery = z.infer<
  typeof blogPostCommentsQuerySchema
>;
export type BlogPostCommentParams = z.infer<
  typeof blogPostCommentParamsSchema
>['params'];
export type CreateBlogPostCommentBody = z.infer<
  typeof createBlogPostCommentSchema
>['body'];
export type UpdateBlogPostCommentBody = z.infer<
  typeof updateBlogPostCommentSchema
>['body'];
