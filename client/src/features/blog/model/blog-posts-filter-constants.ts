import type { BlogPostsFilters } from './blog-posts-filter-types';

export const initialBlogPostsFilters = {
  page: 1,
  search: '',
  tag: '',
} satisfies BlogPostsFilters;
