import type { BlogPostCommentsParams } from '../api';

export const toBlogPostCommentsSearchParams = (
  params: BlogPostCommentsParams = {},
) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  return searchParams;
};
