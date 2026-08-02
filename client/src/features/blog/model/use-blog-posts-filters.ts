import { useCallback, useMemo } from 'react';

import { useDebouncedValue } from '../../../shared/hooks';
import {
  numberParam,
  stringParam,
  useUrlState,
} from '../../../shared/model';
import { initialBlogPostsFilters } from './blog-posts-filter-constants';
import type {
  BlogPostsFilters,
  BlogPostsFiltersState,
} from './blog-posts-filter-types';

const BLOG_POSTS_FILTERS_URL_SCHEMA = {
  search: stringParam({ name: 'search' }),
  page: numberParam({
    name: 'page',
    defaultValue: 1,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

export const useBlogPostsFilters = (): BlogPostsFiltersState => {
  const [filters, setFilters] = useUrlState<BlogPostsFilters>(
    BLOG_POSTS_FILTERS_URL_SCHEMA,
    { replace: true },
  );
  const debouncedSearch = useDebouncedValue(filters.search, 400);
  const debouncedFilters = useMemo<BlogPostsFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters],
  );
  const isDebouncing = filters.search !== debouncedSearch;

  const resetFilters = useCallback(() => {
    setFilters(
      (prev) => ({
        ...initialBlogPostsFilters,
        page: prev.page,
      }),
      { replace: true },
    );
  }, [setFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters(
        (prev) => ({
          ...prev,
          page,
        }),
        { replace: false },
      );
    },
    [setFilters],
  );

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      setFilters,
    }),
    [
      debouncedFilters,
      filters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      setFilters,
    ],
  );
};
