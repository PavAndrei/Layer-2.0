import type { BlogPostDocument } from '../models/blog-posts.model';
import type { AdminBlogPostDto, AdminBlogPostListItemDto } from '../types/api';

export const adminBlogPostToListItemDto = (
  blogPost: BlogPostDocument,
): AdminBlogPostListItemDto => ({
  _id: blogPost._id.toString(),
  authorId: blogPost.authorId.toString(),
  coverImage: blogPost.coverImage,
  excerpt: blogPost.excerpt,
  publishedAt: blogPost.publishedAt?.toISOString() ?? null,
  slug: blogPost.slug,
  status: blogPost.status,
  title: blogPost.title,
  updatedAt: blogPost.updatedAt.toISOString(),
});

export const adminBlogPostToDto = (
  blogPost: BlogPostDocument,
): AdminBlogPostDto => ({
  ...adminBlogPostToListItemDto(blogPost),
  contentHtml: blogPost.contentHtml,
  contentJson: blogPost.contentJson,
  createdAt: blogPost.createdAt.toISOString(),
});
