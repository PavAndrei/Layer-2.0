import { useCallback } from 'react';

import {
  useBlogPosts,
  useBlogPostsFilters,
} from '../../../features/blog';

export const useBlogPage = () => {
  const filters = useBlogPostsFilters();
  const blogPostsQuery = useBlogPosts({
    filters,
  });

  const updateSearch = useCallback(
    (search: string) => {
      filters.setFilters((prev) => ({
        ...prev,
        page: 1,
        search,
      }));
    },
    [filters],
  );

  return {
    blogPostsQuery,
    filters,
    updateSearch,
  };
};
