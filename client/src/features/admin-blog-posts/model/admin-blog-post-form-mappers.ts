import type { AdminBlogPost } from '../api';
import type { AdminBlogPostFormValues } from './admin-blog-post-form-types';

export const createEmptyBlogPostContentJson = () => ({
  type: 'doc',
  content: [],
});

export const toAdminBlogPostFormValues = (
  blogPost: AdminBlogPost,
): AdminBlogPostFormValues => ({
  contentHtml: blogPost.contentHtml,
  contentJson: blogPost.contentJson,
  coverImage: blogPost.coverImage
    ? {
        alt: blogPost.coverImage.alt,
        fileId: blogPost.coverImage.fileId ?? '',
        filePath: blogPost.coverImage.filePath ?? '',
        src: blogPost.coverImage.src,
      }
    : null,
  excerpt: blogPost.excerpt,
  relatedProductIds: blogPost.relatedProductIds,
  slug: blogPost.slug,
  status: blogPost.status,
  tags: blogPost.tags,
  title: blogPost.title,
});
