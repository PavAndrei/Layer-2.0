import { useQuery } from '@tanstack/react-query';

import {
  getAdminBlogPosts,
  type AdminBlogPostsParams,
} from '../api';
import { adminBlogPostsQueryKeys } from './admin-blog-posts-query-keys';
import { toAdminBlogPostsSearchParams } from './admin-blog-posts-search-params';

const ADMIN_BLOG_POSTS_STALE_TIME_MS = 1000 * 60;

type UseAdminBlogPostsOptions = {
  enabled?: boolean;
  params?: AdminBlogPostsParams;
};

export const useAdminBlogPosts = ({
  enabled = true,
  params = {},
}: UseAdminBlogPostsOptions = {}) => {
  const searchParams = toAdminBlogPostsSearchParams(params);
  const query = useQuery({
    queryKey: adminBlogPostsQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getAdminBlogPosts(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_BLOG_POSTS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin blog posts'
        : null;

  return {
    blogPosts: response?.success ? response.data.blogPosts : [],
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
    stats: response?.success ? response.data.stats : null,
  };
};
