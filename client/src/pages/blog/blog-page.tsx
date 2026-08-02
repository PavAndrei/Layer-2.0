import { Button, FeedbackMessage, Pagination } from '../../shared/ui';
import {
  BLOG_POSTS_LIMIT,
  BlogLayout,
  BlogPostsFiltersForm,
  BlogPostsGrid,
  BlogPostsLayoutContent,
  BlogPostsSkeleton,
} from '../../features/blog';
import { SectionedPageHeader } from '../../shared/ui';
import { useBlogPage } from './model';

export const BlogPage = () => {
  const {
    blogPostsQuery,
    filters,
    updateSearch,
  } = useBlogPage();
  const total = blogPostsQuery.pagination?.total ?? 0;

  return (
    <BlogLayout
      header={
        <SectionedPageHeader
          breadcrumbs={[
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Blog',
            },
          ]}
          title="Blog"
          description="Ideas for building a sharper wardrobe, reading product details, and choosing pieces that work beyond one outfit."
        />
      }
      filters={
        <BlogPostsFiltersForm
          search={filters.search}
          onSearchChange={updateSearch}
          onReset={filters.resetFilters}
        />
      }
    >
      <BlogPostsLayoutContent
        error={blogPostsQuery.error}
        errorFallback={
          <FeedbackMessage
            title="Could not load articles"
            description={blogPostsQuery.error}
            tone="danger"
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => blogPostsQuery.refetch()}
              >
                Try again
              </Button>
            }
          />
        }
        emptyFallback={
          <FeedbackMessage
            title="No articles found"
            description="Try changing your search or clearing filters to see more articles."
          />
        }
        isEmpty={total === 0}
        isFetching={blogPostsQuery.isFetching}
        isLoading={blogPostsQuery.isLoading}
        loadingFallback={<BlogPostsSkeleton />}
        total={total}
      >
        <BlogPostsGrid blogPosts={blogPostsQuery.blogPosts} />
        <Pagination
          total={total}
          limit={BLOG_POSTS_LIMIT}
          currentPage={filters.page}
          onPageChange={filters.handlePageChange}
        />
      </BlogPostsLayoutContent>
    </BlogLayout>
  );
};
