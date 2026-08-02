import {
  Button,
  SelectFilter,
  TextInput,
  type SelectFilterOption,
} from '../../../shared/ui';
import type {
  AdminBlogPostSortOption,
  BlogPostStatus,
} from '../api';

type AdminBlogPostsFiltersFormProps = {
  search: string;
  sort: AdminBlogPostSortOption;
  status: BlogPostStatus | '';
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: AdminBlogPostSortOption) => void;
  onStatusChange: (status: BlogPostStatus | '') => void;
};

const statusOptions: readonly SelectFilterOption<BlogPostStatus | ''>[] = [
  {
    label: 'All statuses',
    value: '',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

const sortOptions: readonly SelectFilterOption<AdminBlogPostSortOption>[] = [
  {
    label: 'Recently updated',
    value: 'default',
  },
  {
    label: 'Updated newest',
    value: 'updated-desc',
  },
  {
    label: 'Updated oldest',
    value: 'updated-asc',
  },
  {
    label: 'Published newest',
    value: 'published-desc',
  },
  {
    label: 'Published oldest',
    value: 'published-asc',
  },
  {
    label: 'Title A-Z',
    value: 'title-asc',
  },
  {
    label: 'Title Z-A',
    value: 'title-desc',
  },
];

const getOption = <Value extends string>(
  options: readonly SelectFilterOption<Value>[],
  value: Value,
) => options.find((option) => option.value === value) ?? options[0];

export const AdminBlogPostsFiltersForm = ({
  onReset,
  onSearchChange,
  onSortChange,
  onStatusChange,
  search,
  sort,
  status,
}: AdminBlogPostsFiltersFormProps) => (
  <div className="grid gap-3 rounded border border-border-soft bg-background-surface p-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] lg:items-end">
    <TextInput
      id="admin-blog-posts-search"
      label="Search"
      placeholder="Search title, slug, or excerpt"
      value={search}
      onChange={onSearchChange}
    />
    <SelectFilter
      id="admin-blog-posts-status"
      label="Status"
      options={statusOptions}
      value={getOption(statusOptions, status)}
      onChange={(option) => onStatusChange(option?.value ?? '')}
    />
    <SelectFilter
      id="admin-blog-posts-sort"
      label="Sort"
      options={sortOptions}
      value={getOption(sortOptions, sort)}
      onChange={(option) => onSortChange(option?.value ?? 'default')}
    />
    <Button type="button" variant="secondary" onClick={onReset}>
      Clear filters
    </Button>
  </div>
);
