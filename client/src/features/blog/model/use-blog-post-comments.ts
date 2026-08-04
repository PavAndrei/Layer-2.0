import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  getBlogPostComments,
  type BlogPostCommentsParams,
} from '../api';
import { toBlogPostCommentsSearchParams } from './blog-post-comments-search-params';
import {
  BLOG_POSTS_STALE_TIME_MS,
  blogPostsQueryKeys,
} from './blog-posts-query-keys';

type UseBlogPostCommentsOptions = {
  enabled?: boolean;
  params?: BlogPostCommentsParams;
  slug?: string;
};

export const useBlogPostComments = ({
  enabled = true,
  params = {},
  slug,
}: UseBlogPostCommentsOptions = {}) => {
  const searchParams = useMemo(
    () => toBlogPostCommentsSearchParams(params),
    [params],
  );
  const query = useQuery({
    queryKey: blogPostsQueryKeys.commentsList(
      slug ?? '',
      searchParams.toString(),
    ),
    enabled: enabled && Boolean(slug),
    queryFn: async ({ signal }) => {
      if (!slug) {
        throw new Error('Blog post slug is required');
      }

      const response = await getBlogPostComments(slug, params, signal);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    retry: false,
    staleTime: BLOG_POSTS_STALE_TIME_MS,
  });

  return {
    comments: query.data?.comments ?? [],
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? 'Failed to load blog post comments'
          : null,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    pagination: query.data?.pagination ?? null,
    refetch: query.refetch,
  };
};
