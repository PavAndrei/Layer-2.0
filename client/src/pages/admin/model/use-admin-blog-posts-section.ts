import { useEffect, useMemo } from 'react';

import {
  useAdminBlogPosts,
  useAdminBlogPostsFilters,
} from '../../../features/admin-blog-posts';
import type { AdminSection } from '../../../features/admin';

const ADMIN_BLOG_POSTS_PAGE_LIMIT = 12;

type UseAdminBlogPostsSectionParams = {
  activeSection: AdminSection;
};

export const useAdminBlogPostsSection = ({
  activeSection,
}: UseAdminBlogPostsSectionParams) => {
  const filters = useAdminBlogPostsFilters();
  const {
    debouncedFilters,
    handlePageChange,
    isDebouncing,
    page,
    syncPage,
  } = filters;
  const params = useMemo(
    () => ({
      limit: ADMIN_BLOG_POSTS_PAGE_LIMIT,
      page: debouncedFilters.page,
      search: debouncedFilters.search || undefined,
      sort: debouncedFilters.sort,
      status: debouncedFilters.status || undefined,
    }),
    [debouncedFilters],
  );
  const blogPostsQuery = useAdminBlogPosts({
    enabled: activeSection === 'articles' && !isDebouncing,
    params,
  });

  useEffect(() => {
    if (activeSection !== 'articles') return;
    if (isDebouncing || blogPostsQuery.isPlaceholderData) return;

    const pagination = blogPostsQuery.pagination;

    if (!pagination) return;

    if (pagination.page !== page) {
      syncPage(pagination.page);
    }
  }, [
    activeSection,
    blogPostsQuery.isPlaceholderData,
    blogPostsQuery.pagination,
    isDebouncing,
    page,
    syncPage,
  ]);

  return {
    blogPostsQuery,
    filters,
    onBlogPostDeleted: undefined,
    onPageChange: handlePageChange,
  };
};

export type AdminBlogPostsSectionState = ReturnType<
  typeof useAdminBlogPostsSection
>;
