import type { BlogPostDocument } from '../models/blog-posts.model';
import type {
  BlogPostDto,
  BlogPostListItemDto,
  ProductDto,
} from '../types/api';

export const blogPostToListItemDto = (
  blogPost: BlogPostDocument,
): BlogPostListItemDto => ({
  _id: blogPost._id.toString(),
  coverImage: blogPost.coverImage,
  excerpt: blogPost.excerpt,
  publishedAt: blogPost.publishedAt?.toISOString() ?? null,
  slug: blogPost.slug,
  tags: blogPost.tags ?? [],
  title: blogPost.title,
  updatedAt: blogPost.updatedAt.toISOString(),
  viewsCount: blogPost.viewsCount ?? 0,
});

export const blogPostToDto = (
  blogPost: BlogPostDocument,
  relatedProducts: ProductDto[] = [],
): BlogPostDto => ({
  ...blogPostToListItemDto(blogPost),
  contentHtml: blogPost.contentHtml,
  relatedProducts,
});
