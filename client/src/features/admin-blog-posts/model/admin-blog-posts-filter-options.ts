import type { AdminBlogPostSortOption } from '../api';
import type { BlogPostStatus } from '../../../entities/blog';

export { BLOG_POST_STATUSES } from '../../../entities/blog';

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
