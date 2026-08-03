import type { BlogPostsParams } from '../api';
import { BLOG_POSTS_LIMIT } from './blog-posts-constants';

export const toBlogPostsSearchParams = (
  params: BlogPostsParams,
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  const limit = params.limit ?? BLOG_POSTS_LIMIT;

  if (params.page && params.page > 1) {
    searchParams.set('page', String(params.page));
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.tag) {
    searchParams.set('tag', params.tag);
  }

  searchParams.set('limit', String(limit));

  return searchParams;
};
