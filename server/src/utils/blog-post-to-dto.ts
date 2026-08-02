import type { BlogPostDocument } from '../models/blog-posts.model';
import type { BlogPostDto, BlogPostListItemDto } from '../types/api';

export const blogPostToListItemDto = (
  blogPost: BlogPostDocument,
): BlogPostListItemDto => ({
  _id: blogPost._id.toString(),
  coverImage: blogPost.coverImage,
  excerpt: blogPost.excerpt,
  publishedAt: blogPost.publishedAt?.toISOString() ?? null,
  slug: blogPost.slug,
  title: blogPost.title,
  updatedAt: blogPost.updatedAt.toISOString(),
});

export const blogPostToDto = (
  blogPost: BlogPostDocument,
): BlogPostDto => ({
  ...blogPostToListItemDto(blogPost),
  contentHtml: blogPost.contentHtml,
});
