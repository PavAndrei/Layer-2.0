import { Request, Response } from 'express';

import {
  getBlogPostBySlugData,
  getBlogPostsData,
  trackBlogPostViewData,
} from '../services/blog-posts.service';
import type {
  BlogPostResponse,
  BlogPostsResponse,
  TrackBlogPostViewResponse,
} from '../types/api';
import type {
  BlogPostParams,
  BlogPostsQuery,
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
  const data = await getBlogPostBySlugData(slug);

  res.status(200).json({
    message: 'Blog post fetched successfully',
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
