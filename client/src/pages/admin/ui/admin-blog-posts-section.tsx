import { Link } from 'react-router';

import {
  AdminBlogPostsFiltersForm,
  AdminBlogPostsGrid,
  AdminBlogPostsStatCards,
} from '../../../features/admin-blog-posts';
import {
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../../shared/ui';
import type { AdminBlogPostsSectionState } from '../model';

const AdminBlogPostsStatsSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-32 w-full" />
    ))}
  </div>
);

const AdminBlogPostsGridSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-20 w-full" />
    ))}
  </div>
);

export const AdminBlogPostsSection = ({
  blogPostsQuery,
  filters,
  onBlogPostDeleted,
  onPageChange,
}: AdminBlogPostsSectionState) => {
  const isWaitingForInitialBlogPosts =
    blogPostsQuery.blogPosts.length === 0 &&
    (blogPostsQuery.isLoading || filters.isDebouncing);
  const stats = blogPostsQuery.stats ? (
    <AdminBlogPostsStatCards stats={blogPostsQuery.stats} />
  ) : isWaitingForInitialBlogPosts ? (
    <AdminBlogPostsStatsSkeleton />
  ) : undefined;
  const filtersForm = (
    <AdminBlogPostsFiltersForm
      search={filters.search}
      sort={filters.sort}
      status={filters.status}
      onReset={filters.resetFilters}
      onSearchChange={filters.handleSearchChange}
      onSortChange={filters.handleSortChange}
      onStatusChange={filters.handleStatusChange}
    />
  );

  let content = null;

  if (isWaitingForInitialBlogPosts) {
    content = <AdminBlogPostsGridSkeleton />;
  } else if (blogPostsQuery.error) {
    content = (
      <FeedbackMessage
        tone="danger"
        title="Articles are unavailable"
        description={blogPostsQuery.error}
      />
    );
  } else if (blogPostsQuery.blogPosts.length === 0) {
    content = (
      <FeedbackMessage
        title="No articles found"
        description="Create the first draft or adjust filters."
      />
    );
  } else {
    content = (
      <AdminBlogPostsGrid
        blogPosts={blogPostsQuery.blogPosts}
        onBlogPostDeleted={onBlogPostDeleted}
      />
    );
  }

  const pagination =
    !isWaitingForInitialBlogPosts &&
    !blogPostsQuery.error &&
    blogPostsQuery.blogPosts.length > 0 &&
    blogPostsQuery.pagination ? (
      <Pagination
        currentPage={blogPostsQuery.pagination.page}
        limit={blogPostsQuery.pagination.limit}
        total={blogPostsQuery.pagination.total}
        onPageChange={onPageChange}
      />
    ) : undefined;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          title="Articles"
          description="Manage drafts, publication status, article covers, and editor content."
        />
        <Link
          to="/admin/blog-posts/new"
          className="inline-flex min-h-10 w-fit items-center justify-center rounded border border-accent-primary bg-accent-primary px-4 py-2 block-medium text-background-surface transition-colors hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black"
        >
          Add article
        </Link>
      </div>

      {stats}
      {filtersForm}
      {content}
      {pagination}
    </section>
  );
};
