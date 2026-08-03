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
  tag?: string;
};

export type BlogPostsResponseData = {
  blogPosts: BlogPostListItem[];
  pagination: PaginationData;
};

export type BlogPostResponseData = {
  blogPost: BlogPost;
};

export type TrackBlogPostViewResponseData = {
  counted: boolean;
  viewsCount: number;
};

export type SetBlogPostLikePayload = {
  liked: boolean;
  slug: string;
};

export type SetBlogPostLikeResponseData = {
  liked: boolean;
  likesCount: number;
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

export const trackBlogPostView = async (
  slug: string,
  signal?: AbortSignal,
): Promise<ApiResponse<TrackBlogPostViewResponseData>> => {
  return apiClient.post<TrackBlogPostViewResponseData>({
    path: `/blog-posts/${encodeURIComponent(slug)}/view`,
    signal,
    errorMessage: 'Failed to track blog post view',
  });
};

export const setBlogPostLike = async (
  { liked, slug }: SetBlogPostLikePayload,
  signal?: AbortSignal,
): Promise<ApiResponse<SetBlogPostLikeResponseData>> => {
  return apiClient.patch<SetBlogPostLikeResponseData, { liked: boolean }>({
    path: `/blog-posts/${encodeURIComponent(slug)}/like`,
    body: {
      liked,
    },
    signal,
    errorMessage: 'Failed to update blog post like',
  });
};
