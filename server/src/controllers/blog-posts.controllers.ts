import { Request, Response } from 'express';

import {
  getBlogPostBySlugData,
  getBlogPostsData,
} from '../services/blog-posts.service';
import type { BlogPostResponse, BlogPostsResponse } from '../types/api';
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
