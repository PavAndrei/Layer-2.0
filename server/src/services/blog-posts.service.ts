import { QueryFilter } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { BlogPost, type BlogPostData } from '../models/blog-posts.model';
import type { BlogPostResponse, BlogPostsResponse } from '../types/api';
import {
  blogPostToDto,
  blogPostToListItemDto,
} from '../utils/blog-post-to-dto';
import type { BlogPostsQuery } from '../validators/blog-posts.validators';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getBlogPostsFilter = (
  query: BlogPostsQuery,
): QueryFilter<BlogPostData> => {
  const filter: QueryFilter<BlogPostData> = {
    status: 'published',
  };

  if (query.search) {
    const searchExpression = {
      $regex: escapeRegExp(query.search),
      $options: 'i',
    };

    filter.$or = [
      { title: searchExpression },
      { excerpt: searchExpression },
    ];
  }

  return filter;
};

export const getBlogPostsData = async (
  query: BlogPostsQuery,
): Promise<BlogPostsResponse['data']> => {
  const filter = getBlogPostsFilter(query);
  const total = await BlogPost.countDocuments(filter);
  const totalPages = Math.ceil(total / query.limit);
  const safePage = Math.min(query.page, totalPages || 1);
  const blogPosts = await BlogPost.find(filter)
    .sort({
      publishedAt: -1,
      _id: -1,
    })
    .skip((safePage - 1) * query.limit)
    .limit(query.limit);

  return {
    blogPosts: blogPosts.map(blogPostToListItemDto),
    pagination: {
      total,
      page: safePage,
      limit: query.limit,
      totalPages,
    },
  };
};

export const getBlogPostBySlugData = async (
  slug: string,
): Promise<BlogPostResponse['data']> => {
  const blogPost = await BlogPost.findOne({
    slug,
    status: 'published',
  });

  if (!blogPost) {
    throw ApiError.NotFound('Blog post not found');
  }

  return {
    blogPost: blogPostToDto(blogPost),
  };
};
