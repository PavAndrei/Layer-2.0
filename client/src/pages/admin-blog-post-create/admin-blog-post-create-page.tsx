import { AdminBlogPostForm } from '../../features/admin-blog-posts';
import { SectionedPageHeader } from '../../shared/ui';
import { useAdminBlogPostCreatePage } from './model';

const ADMIN_BLOG_POST_CREATE_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Articles', to: '/admin?section=articles' },
  { label: 'New article' },
];

export const AdminBlogPostCreatePage = () => {
  const pageState = useAdminBlogPostCreatePage();

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <SectionedPageHeader
        breadcrumbs={ADMIN_BLOG_POST_CREATE_BREADCRUMBS}
        title="New article"
        description="Create a draft article with status, cover media, and rich editor content."
      />

      <AdminBlogPostForm
        error={pageState.error}
        fieldErrors={pageState.fieldErrors}
        isSubmitting={pageState.isSubmitting}
        values={pageState.values}
        onContentChange={pageState.onContentChange}
        onCoverImageChange={pageState.onCoverImageChange}
        onReset={pageState.onReset}
        onSubmit={pageState.onSubmit}
        onValueChange={pageState.onValueChange}
      />
    </main>
  );
};
