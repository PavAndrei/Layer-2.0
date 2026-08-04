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
  commentsCount: blogPost.commentsCount ?? 0,
  coverImage: blogPost.coverImage,
  excerpt: blogPost.excerpt,
  publishedAt: blogPost.publishedAt?.toISOString() ?? null,
  slug: blogPost.slug,
  tags: blogPost.tags ?? [],
  title: blogPost.title,
  updatedAt: blogPost.updatedAt.toISOString(),
  likesCount: blogPost.likesCount ?? 0,
  viewsCount: blogPost.viewsCount ?? 0,
});

export const blogPostToDto = (
  blogPost: BlogPostDocument,
  relatedProducts: ProductDto[] = [],
  isLikedByViewer = false,
): BlogPostDto => ({
  ...blogPostToListItemDto(blogPost),
  contentHtml: blogPost.contentHtml,
  isLikedByViewer,
  relatedProducts,
});
