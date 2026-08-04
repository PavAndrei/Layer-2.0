import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';
import type {
  BlogPost,
  BlogPostComment,
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

export type BlogPostCommentsParams = {
  limit?: number;
  page?: number;
};

export type BlogPostCommentsResponseData = {
  comments: BlogPostComment[];
  pagination: PaginationData;
};

export type CreateBlogPostCommentPayload = {
  parentCommentId?: string | null;
  text: string;
};

export type CreateBlogPostCommentParams = {
  comment: CreateBlogPostCommentPayload;
  slug: string;
};

export type UpdateBlogPostCommentPayload = {
  text: string;
};

export type UpdateBlogPostCommentParams = {
  comment: UpdateBlogPostCommentPayload;
  commentId: string;
  slug: string;
};

export type DeleteBlogPostCommentParams = {
  commentId: string;
  slug: string;
};

export type CreateBlogPostCommentResponseData = {
  comment: BlogPostComment;
};

export type UpdateBlogPostCommentResponseData = {
  comment: BlogPostComment;
};

export type DeleteBlogPostCommentResponseData = {
  comment: BlogPostComment;
  commentId: string;
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

export const getBlogPostComments = async (
  slug: string,
  params: BlogPostCommentsParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<BlogPostCommentsResponseData>> => {
  return apiClient.get<BlogPostCommentsResponseData>({
    path: `/blog-posts/${encodeURIComponent(slug)}/comments`,
    params,
    signal,
    errorMessage: 'Failed to load blog post comments',
  });
};

export const createBlogPostComment = async ({
  comment,
  slug,
}: CreateBlogPostCommentParams): Promise<
  ApiResponse<CreateBlogPostCommentResponseData>
> => {
  return apiClient.post<
    CreateBlogPostCommentResponseData,
    CreateBlogPostCommentPayload
  >({
    path: `/blog-posts/${encodeURIComponent(slug)}/comments`,
    body: comment,
    errorMessage: 'Failed to create blog post comment',
  });
};

export const updateBlogPostComment = async ({
  comment,
  commentId,
  slug,
}: UpdateBlogPostCommentParams): Promise<
  ApiResponse<UpdateBlogPostCommentResponseData>
> => {
  return apiClient.patch<
    UpdateBlogPostCommentResponseData,
    UpdateBlogPostCommentPayload
  >({
    path: `/blog-posts/${encodeURIComponent(slug)}/comments/${commentId}`,
    body: comment,
    errorMessage: 'Failed to update blog post comment',
  });
};

export const deleteBlogPostComment = async ({
  commentId,
  slug,
}: DeleteBlogPostCommentParams): Promise<
  ApiResponse<DeleteBlogPostCommentResponseData>
> => {
  return apiClient.delete<DeleteBlogPostCommentResponseData>({
    path: `/blog-posts/${encodeURIComponent(slug)}/comments/${commentId}`,
    errorMessage: 'Failed to delete blog post comment',
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
