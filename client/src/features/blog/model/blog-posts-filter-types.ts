import type { UrlStateSetter } from '../../../shared/model';

export type BlogPostsFilters = {
  page: number;
  search: string;
  tag: string;
};

export type BlogPostsFiltersState = BlogPostsFilters & {
  debouncedFilters: BlogPostsFilters;
  handlePageChange: (page: number) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  setFilters: UrlStateSetter<BlogPostsFilters>;
};
