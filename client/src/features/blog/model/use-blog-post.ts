import { useQuery } from '@tanstack/react-query';

import { getBlogPostBySlug } from '../api';
import {
  BLOG_POSTS_STALE_TIME_MS,
  blogPostsQueryKeys,
} from './blog-posts-query-keys';

export const useBlogPost = (slug?: string) => {
  const query = useQuery({
    queryKey: blogPostsQueryKeys.detail(slug ?? ''),
    enabled: Boolean(slug),
    queryFn: async ({ signal }) => {
      if (!slug) {
        throw new Error('Blog post slug is required');
      }

      const response = await getBlogPostBySlug(slug, signal);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    retry: false,
    staleTime: BLOG_POSTS_STALE_TIME_MS,
  });

  return {
    blogPost: query.data?.blogPost ?? null,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? 'Failed to load blog post'
          : null,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
