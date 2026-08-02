import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  getBlogPosts,
  type BlogPostsParams,
} from '../api';
import {
  BLOG_POSTS_STALE_TIME_MS,
  blogPostsQueryKeys,
} from './blog-posts-query-keys';
import { toBlogPostsSearchParams } from './blog-posts-search-params';
import type { BlogPostsFiltersState } from './blog-posts-filter-types';

type UseBlogPostsOptions = {
  enabled?: boolean;
  filters?: BlogPostsFiltersState;
  params?: BlogPostsParams;
};

export const useBlogPosts = ({
  enabled = true,
  filters,
  params = {},
}: UseBlogPostsOptions = {}) => {
  const requestParams = useMemo<BlogPostsParams>(
    () => ({
      ...params,
      ...(filters?.debouncedFilters ?? {}),
    }),
    [filters?.debouncedFilters, params],
  );
  const searchParams = useMemo(
    () => toBlogPostsSearchParams(requestParams),
    [requestParams],
  );
  const isDebouncing = filters?.isDebouncing ?? false;
  const query = useQuery({
    queryKey: blogPostsQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getBlogPosts(requestParams, signal),
    enabled: enabled && !isDebouncing,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: BLOG_POSTS_STALE_TIME_MS,
  });

  const response = query.data;

  useEffect(() => {
    if (!filters || isDebouncing || query.isPlaceholderData) return;
    if (!response?.success) return;

    const { pagination } = response.data;

    if (pagination.page !== filters.page) {
      filters.setFilters((prev) => ({
        ...prev,
        page: pagination.page,
      }));
    }
  }, [
    filters,
    isDebouncing,
    query.isPlaceholderData,
    response,
  ]);

  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load blog posts'
        : null;

  return {
    blogPosts: response?.success ? response.data.blogPosts : [],
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
  };
};
