import { Link } from 'react-router';

import { AdminBlogPostForm } from '../../features/admin-blog-posts';
import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  Button,
  FeedbackMessage,
  SectionedPageHeader,
  Skeleton,
} from '../../shared/ui';
import { useAdminBlogPostEditPage } from './model';

const getAdminBlogPostEditBreadcrumbs = (blogPostTitle?: string) => [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Articles', to: '/admin?section=articles' },
  { label: blogPostTitle ? `Edit ${blogPostTitle}` : 'Edit article' },
];

const AdminBlogPostEditPageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-96 w-full" />
  </div>
);

export const AdminBlogPostEditPage = () => {
  const pageState = useAdminBlogPostEditPage();
  const { blogPost } = pageState;

  useScrollToTopOnChange(pageState.blogPostId, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <SectionedPageHeader
        breadcrumbs={getAdminBlogPostEditBreadcrumbs(blogPost?.title)}
        title={blogPost ? `Edit ${blogPost.title}` : 'Edit article'}
        description={
          blogPost
            ? `Update article content, media, and publication state for ${blogPost.slug}.`
            : 'Load article details before making content changes.'
        }
      />

      {pageState.isLoading && <AdminBlogPostEditPageSkeleton />}

      {!pageState.isLoading && !blogPost && (
        <FeedbackMessage
          tone="danger"
          title="Article is unavailable"
          description={
            pageState.loadError ??
            'Refresh the page or return to admin articles.'
          }
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => pageState.onRefetch()}
              >
                Try again
              </Button>
              <Link
                to="/admin?section=articles"
                className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
              >
                Back to articles
              </Link>
            </div>
          }
        />
      )}

      {!pageState.isLoading && blogPost && (
        <AdminBlogPostForm
          error={pageState.error}
          errorTitle="Article could not be updated"
          fieldErrors={pageState.fieldErrors}
          isSubmitting={pageState.isSubmitting}
          resetLabel="Reset changes"
          submitLabel="Save changes"
          submittingLabel="Saving..."
          successMessage={pageState.successMessage}
          values={pageState.values}
          onContentChange={pageState.onContentChange}
          onCoverImageChange={pageState.onCoverImageChange}
          onReset={pageState.onReset}
          onSubmit={pageState.onSubmit}
          onValueChange={pageState.onValueChange}
        />
      )}
    </main>
  );
};
