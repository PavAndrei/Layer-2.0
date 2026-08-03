import { useCallback } from 'react';

import {
  useBlogPostTags,
  useBlogPosts,
  useBlogPostsFilters,
} from '../../../features/blog';

export const useBlogPage = () => {
  const filters = useBlogPostsFilters();
  const blogPostsQuery = useBlogPosts({
    filters,
  });
  const tagsQuery = useBlogPostTags();

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
  const clearTag = useCallback(() => {
    filters.setFilters((prev) => ({
      ...prev,
      page: 1,
      tag: '',
    }));
  }, [filters]);
  const updateTag = useCallback(
    (tag: string) => {
      filters.setFilters((prev) => ({
        ...prev,
        page: 1,
        tag,
      }));
    },
    [filters],
  );

  return {
    blogPostsQuery,
    clearTag,
    filters,
    tagsQuery,
    updateSearch,
    updateTag,
  };
};
