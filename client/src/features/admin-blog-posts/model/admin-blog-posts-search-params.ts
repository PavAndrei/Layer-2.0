import type { AdminBlogPostsParams } from '../api';

export const toAdminBlogPostsSearchParams = (
  params: AdminBlogPostsParams,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;

    searchParams.set(key, String(value));
  });

  return searchParams;
};
