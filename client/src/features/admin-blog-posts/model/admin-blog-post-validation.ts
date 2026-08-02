import { z } from 'zod';

import type { CreateAdminBlogPostPayload } from '../api';
import type { AdminBlogPostFormErrors } from './admin-blog-post-form-types';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

type RichTextContentNode = {
  attrs?: Record<string, unknown>;
  content?: unknown;
  text?: unknown;
  type?: unknown;
};

const hasPublishableContentNode = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false;

  const contentNode = node as RichTextContentNode;

  if (typeof contentNode.text === 'string' && contentNode.text.trim()) {
    return true;
  }

  if (
    typeof contentNode.type === 'string' &&
    ['image', 'video', 'iframe'].includes(contentNode.type) &&
    contentNode.attrs &&
    Object.values(contentNode.attrs).some(
      (value) => typeof value === 'string' && value.trim(),
    )
  ) {
    return true;
  }

  if (Array.isArray(contentNode.content)) {
    return contentNode.content.some(hasPublishableContentNode);
  }

  return false;
};

const hasPublishableBlogPostContent = (contentJson: unknown) => {
  return hasPublishableContentNode(contentJson);
};

const optionalSlugField = z
  .string()
  .trim()
  .toLowerCase()
  .transform((value) => (value ? value : undefined))
  .refine(
    (value) => value === undefined || SLUG_PATTERN.test(value),
    'Invalid slug',
  )
  .refine(
    (value) => value === undefined || value.length <= 180,
    'Slug is too long',
  );

const requiredUrlField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .url(`${fieldName} must be a valid URL`)
    .max(500, `${fieldName} is too long`);

const optionalImageKitFileIdField = z
  .string()
  .trim()
  .transform((value) => (value ? value : undefined))
  .refine(
    (value) => value === undefined || value.length <= 200,
    'ImageKit file id is too long',
  )
  .refine(
    (value) => value === undefined || /^[A-Za-z0-9_-]+$/.test(value),
    'Invalid ImageKit file id',
  );

const optionalImageKitFilePathField = z
  .string()
  .trim()
  .transform((value) => (value ? value : undefined))
  .refine(
    (value) => value === undefined || value.length <= 500,
    'ImageKit file path is too long',
  );

const coverImageSchema = z
  .object({
    alt: z
      .string()
      .trim()
      .min(3, 'Cover image alt text is too short')
      .max(180, 'Cover image alt text is too long'),
    fileId: optionalImageKitFileIdField,
    filePath: optionalImageKitFilePathField,
    src: requiredUrlField('Cover image'),
  })
  .strict();

export const adminBlogPostFormSchema = z
  .object({
    contentHtml: z.string().max(120000, 'Content is too long'),
    contentJson: z.record(z.string(), z.unknown()),
    coverImage: coverImageSchema.nullable(),
    excerpt: z.string().trim().max(360, 'Excerpt is too long'),
    slug: optionalSlugField,
    status: z.enum(['draft', 'published', 'archived']),
    title: z
      .string()
      .trim()
      .min(2, 'Title is too short')
      .max(180, 'Title is too long'),
  })
  .strict()
  .superRefine((values, ctx) => {
    if (values.status !== 'published') return;

    if (!hasPublishableBlogPostContent(values.contentJson)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Content is required before publishing',
        path: ['contentHtml'],
      });
    }
  });

export type AdminBlogPostFormParsedValues = z.infer<
  typeof adminBlogPostFormSchema
>;

export const toCreateAdminBlogPostPayload = (
  values: AdminBlogPostFormParsedValues,
): CreateAdminBlogPostPayload => ({
  contentHtml: values.contentHtml,
  contentJson: values.contentJson,
  coverImage: values.coverImage
    ? {
        alt: values.coverImage.alt,
        fileId: values.coverImage.fileId,
        filePath: values.coverImage.filePath,
        src: values.coverImage.src,
      }
    : null,
  excerpt: values.excerpt,
  slug: values.slug,
  status: values.status,
  title: values.title,
});

export const getAdminBlogPostFormErrors = (
  error: z.ZodError,
): AdminBlogPostFormErrors => {
  return error.issues.reduce<AdminBlogPostFormErrors>((errors, issue) => {
    const [fieldName, nestedFieldName] = issue.path;

    if (fieldName === 'coverImage') {
      return {
        ...errors,
        coverImage:
          errors.coverImage ??
          (typeof nestedFieldName === 'string'
            ? `${nestedFieldName}: ${issue.message}`
            : issue.message),
      };
    }

    if (typeof fieldName !== 'string') return errors;

    if (
      fieldName === 'contentHtml' ||
      fieldName === 'contentJson' ||
      fieldName === 'excerpt' ||
      fieldName === 'slug' ||
      fieldName === 'status' ||
      fieldName === 'title'
    ) {
      return {
        ...errors,
        [fieldName]: errors[fieldName] ?? issue.message,
      };
    }

    return errors;
  }, {});
};
