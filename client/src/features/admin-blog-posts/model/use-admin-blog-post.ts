import { useQuery } from '@tanstack/react-query';

import { getAdminBlogPost } from '../api';
import { adminBlogPostsQueryKeys } from './admin-blog-posts-query-keys';

const ADMIN_BLOG_POST_STALE_TIME_MS = 1000 * 60;

export const useAdminBlogPost = (blogPostId: string | undefined) => {
  const query = useQuery({
    queryKey: blogPostId
      ? adminBlogPostsQueryKeys.detail(blogPostId)
      : adminBlogPostsQueryKeys.detail(''),
    queryFn: ({ signal }) => getAdminBlogPost(blogPostId ?? '', signal),
    enabled: Boolean(blogPostId),
    retry: false,
    staleTime: ADMIN_BLOG_POST_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin blog post'
        : null;

  return {
    blogPost: response?.success ? response.data.blogPost : null,
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
