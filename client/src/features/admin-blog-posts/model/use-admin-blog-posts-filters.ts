import { useCallback, useMemo } from 'react';

import { useDebouncedValue } from '../../../shared/hooks';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';
import type { AdminBlogPostSortOption } from '../api';
import {
  ADMIN_BLOG_POST_SORT_OPTIONS,
  BLOG_POST_STATUSES,
  type AdminBlogPostStatusFilterValue,
} from './admin-blog-posts-filter-options';

export type AdminBlogPostsFilters = {
  page: number;
  search: string;
  sort: AdminBlogPostSortOption;
  status: AdminBlogPostStatusFilterValue;
};

type AdminBlogPostsUrlState = AdminBlogPostsFilters & {
  section: string;
};

export type AdminBlogPostsFiltersState = AdminBlogPostsFilters & {
  debouncedFilters: AdminBlogPostsFilters;
  handlePageChange: (page: number) => void;
  handleSearchChange: (search: string) => void;
  handleSortChange: (sort: AdminBlogPostsFilters['sort']) => void;
  handleStatusChange: (status: AdminBlogPostsFilters['status']) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminBlogPostsFilters: AdminBlogPostsFilters = {
  page: 1,
  search: '',
  sort: 'default',
  status: '',
};

const initialAdminBlogPostsUrlState: AdminBlogPostsUrlState = {
  ...initialAdminBlogPostsFilters,
  section: '',
};

const ADMIN_BLOG_POSTS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  search: stringParam({ name: 'search' }),
  status: customParam<AdminBlogPostsFilters['status']>({
    parse: (searchParams) => {
      const status = searchParams.get('status');

      return (
        BLOG_POST_STATUSES.find((blogPostStatus) => blogPostStatus === status) ??
        ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('status');
        return;
      }

      searchParams.set('status', value);
    },
  }),
  sort: customParam<AdminBlogPostsFilters['sort']>({
    parse: (searchParams) => {
      const sort = searchParams.get('sort');

      return (
        ADMIN_BLOG_POST_SORT_OPTIONS.find((sortOption) => sortOption === sort) ??
        initialAdminBlogPostsFilters.sort
      );
    },
    serialize: (searchParams, value) => {
      if (value === initialAdminBlogPostsFilters.sort) {
        searchParams.delete('sort');
        return;
      }

      searchParams.set('sort', value);
    },
  }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminBlogPostsFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  page,
  search,
  sort,
  status,
}: AdminBlogPostsUrlState): AdminBlogPostsFilters => ({
  page,
  search,
  sort,
  status,
});

export const useAdminBlogPostsFilters = (): AdminBlogPostsFiltersState => {
  const [urlState, setUrlState] = useUrlState<AdminBlogPostsUrlState>(
    ADMIN_BLOG_POSTS_FILTERS_URL_SCHEMA,
    { replace: true },
  );

  const filters = useMemo(() => toFilters(urlState), [urlState]);

  const setFilters = useCallback<UrlStateSetter<AdminBlogPostsFilters>>(
    (value, options) => {
      setUrlState((prev) => {
        const previousFilters = toFilters(prev);
        const nextFilters =
          typeof value === 'function'
            ? (value as (
              state: AdminBlogPostsFilters,
            ) => AdminBlogPostsFilters)(previousFilters)
            : value;

        return {
          ...prev,
          ...nextFilters,
        };
      }, options);
    },
    [setUrlState],
  );

  const debouncedSearch = useDebouncedValue(filters.search, 400);

  const debouncedFilters = useMemo<AdminBlogPostsFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters],
  );

  const isDebouncing = filters.search !== debouncedSearch;

  const resetFilters = useCallback(() => {
    setUrlState(
      (prev) => ({
        ...initialAdminBlogPostsUrlState,
        section: prev.section,
      }),
      { replace: true },
    );
  }, [setUrlState]);

  const updateFilter = useCallback(
    <Key extends keyof AdminBlogPostsFilters>(
      field: Key,
      value: AdminBlogPostsFilters[Key],
    ) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [field]: value,
      }));
    },
    [setFilters],
  );

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

  const syncPage = useCallback(
    (page: number) => {
      setFilters((prev) => ({
        ...prev,
        page,
      }));
    },
    [setFilters],
  );

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      handlePageChange,
      handleSearchChange: (search: string) =>
        updateFilter('search', search),
      handleSortChange: (sort: AdminBlogPostsFilters['sort']) =>
        updateFilter('sort', sort),
      handleStatusChange: (status: AdminBlogPostsFilters['status']) =>
        updateFilter('status', status),
      isDebouncing,
      resetFilters,
      syncPage,
    }),
    [
      debouncedFilters,
      filters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      syncPage,
      updateFilter,
    ],
  );
};
