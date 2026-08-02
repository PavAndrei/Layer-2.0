import type {
  AdminBlogPostSortOption,
  BlogPostStatus,
} from '../api';

export const BLOG_POST_STATUSES: readonly BlogPostStatus[] = [
  'draft',
  'published',
  'archived',
];

export const ADMIN_BLOG_POST_SORT_OPTIONS: readonly AdminBlogPostSortOption[] = [
  'default',
  'updated-desc',
  'updated-asc',
  'published-desc',
  'published-asc',
  'title-asc',
  'title-desc',
];

export type AdminBlogPostStatusFilterValue = BlogPostStatus | '';
