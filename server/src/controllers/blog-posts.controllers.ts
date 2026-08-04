import { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  createBlogPostCommentData,
  deleteBlogPostCommentData,
  getBlogPostCommentsData,
  updateBlogPostCommentData,
} from '../services/blog-post-comments.service';
import {
  getBlogPostBySlugData,
  getBlogPostsData,
  setBlogPostLikeData,
  trackBlogPostViewData,
} from '../services/blog-posts.service';
import type {
  BlogPostResponse,
  BlogPostCommentsResponse,
  BlogPostsResponse,
  CreateBlogPostCommentResponse,
  DeleteBlogPostCommentResponse,
  SetBlogPostLikeResponse,
  TrackBlogPostViewResponse,
  UpdateBlogPostCommentResponse,
} from '../types/api';
import type {
  BlogPostCommentParams,
  BlogPostCommentsQuery,
  BlogPostParams,
  BlogPostsQuery,
  CreateBlogPostCommentBody,
  SetBlogPostLikeBody,
  UpdateBlogPostCommentBody,
} from '../validators/blog-posts.validators';

export const getBlogPosts = async (
  req: Request,
  res: Response<BlogPostsResponse>,
) => {
  const data = await getBlogPostsData(
    req.validated?.query as BlogPostsQuery,
  );

  res.status(200).json({
    message: 'Blog posts fetched successfully',
    success: true,
    data,
  });
};

export const getBlogPostBySlug = async (
  req: Request,
  res: Response<BlogPostResponse>,
) => {
  const { slug } = req.validated?.params as BlogPostParams;
  const data = await getBlogPostBySlugData(slug, {
    ip: getRequestIp(req),
    userAgent: req.get('user-agent') ?? 'unknown',
  });

  res.status(200).json({
    message: 'Blog post fetched successfully',
    success: true,
    data,
  });
};

const getAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  return req.user;
};

export const setBlogPostLike = async (
  req: Request,
  res: Response<SetBlogPostLikeResponse>,
) => {
  const { slug } = req.validated?.params as BlogPostParams;
  const { liked } = req.body as SetBlogPostLikeBody;
  const data = await setBlogPostLikeData({
    ip: getRequestIp(req),
    liked,
    slug,
    userAgent: req.get('user-agent') ?? 'unknown',
  });

  res.status(200).json({
    message: data.liked
      ? 'Blog post liked successfully'
      : 'Blog post like removed successfully',
    success: true,
    data,
  });
};

export const getBlogPostComments = async (
  req: Request,
  res: Response<BlogPostCommentsResponse>,
) => {
  const { slug } = req.validated?.params as BlogPostParams;
  const data = await getBlogPostCommentsData(
    slug,
    req.validated?.query as BlogPostCommentsQuery,
  );

  res.status(200).json({
    message: 'Blog post comments fetched successfully',
    success: true,
    data,
  });
};

export const createBlogPostComment = async (
  req: Request,
  res: Response<CreateBlogPostCommentResponse>,
) => {
  const { slug } = req.validated?.params as BlogPostParams;
  const user = getAuthenticatedUser(req);
  const data = await createBlogPostCommentData(
    slug,
    user.userId,
    req.validated?.body as CreateBlogPostCommentBody,
  );

  res.status(201).json({
    message: 'Blog post comment created successfully',
    success: true,
    data,
  });
};

export const updateBlogPostComment = async (
  req: Request,
  res: Response<UpdateBlogPostCommentResponse>,
) => {
  const { commentId, slug } =
    req.validated?.params as BlogPostCommentParams;
  const user = getAuthenticatedUser(req);
  const data = await updateBlogPostCommentData(
    slug,
    {
      role: user.role,
      userId: user.userId,
    },
    commentId,
    req.validated?.body as UpdateBlogPostCommentBody,
  );

  res.status(200).json({
    message: 'Blog post comment updated successfully',
    success: true,
    data,
  });
};

export const deleteBlogPostComment = async (
  req: Request,
  res: Response<DeleteBlogPostCommentResponse>,
) => {
  const { commentId, slug } =
    req.validated?.params as BlogPostCommentParams;
  const user = getAuthenticatedUser(req);
  const data = await deleteBlogPostCommentData(
    slug,
    {
      role: user.role,
      userId: user.userId,
    },
    commentId,
  );

  res.status(200).json({
    message: 'Blog post comment deleted successfully',
    success: true,
    data,
  });
};

const getRequestIp = (req: Request) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() || req.ip || 'unknown';
  }

  return req.ip || 'unknown';
};

export const trackBlogPostView = async (
  req: Request,
  res: Response<TrackBlogPostViewResponse>,
) => {
  const { slug } = req.validated?.params as BlogPostParams;
  const data = await trackBlogPostViewData({
    ip: getRequestIp(req),
    slug,
    userAgent: req.get('user-agent') ?? 'unknown',
  });

  res.status(200).json({
    message: data.counted
      ? 'Blog post view tracked successfully'
      : 'Blog post view already tracked recently',
    success: true,
    data,
  });
};
