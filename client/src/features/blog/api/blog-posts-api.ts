import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';
import type {
  BlogPost,
  BlogPostListItem,
} from '../../../entities/blog';

export type BlogPostsParams = {
  limit?: number;
  page?: number;
  search?: string;
};

export type BlogPostsResponseData = {
  blogPosts: BlogPostListItem[];
  pagination: PaginationData;
};

export type BlogPostResponseData = {
  blogPost: BlogPost;
};

export const getBlogPosts = async (
  params: BlogPostsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<BlogPostsResponseData>> => {
  return apiClient.get<BlogPostsResponseData>({
    path: '/blog-posts',
    params,
    signal,
    errorMessage: 'Failed to load blog posts',
  });
};

export const getBlogPostBySlug = async (
  slug: string,
  signal?: AbortSignal,
): Promise<ApiResponse<BlogPostResponseData>> => {
  return apiClient.get<BlogPostResponseData>({
    path: `/blog-posts/${encodeURIComponent(slug)}`,
    signal,
    errorMessage: 'Failed to load blog post',
  });
};
