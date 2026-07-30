import { Link } from 'react-router';

import { AdminProductForm } from '../../features/admin-products';
import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  Button,
  FeedbackMessage,
  SectionedPageHeader,
  Skeleton,
} from '../../shared/ui';
import { useAdminProductEditPage } from './model';

const getAdminProductEditBreadcrumbs = (productTitle?: string) => [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Products', to: '/admin?section=products' },
  { label: productTitle ? `Edit ${productTitle}` : 'Edit product' },
];

const AdminProductEditPageSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-36 w-full" />
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
    <Skeleton className="h-80 w-full" />
    <Skeleton className="h-80 w-full" />
  </div>
);

export const AdminProductEditPage = () => {
  const pageState = useAdminProductEditPage();
  const { product } = pageState;

  useScrollToTopOnChange(pageState.productId, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <SectionedPageHeader
        breadcrumbs={getAdminProductEditBreadcrumbs(product?.title)}
        title={product ? `Edit ${product.title}` : 'Edit product'}
        description={
          product
            ? `Update catalog data, pricing, variants, stock, and media for ${product.slug}.`
            : 'Load product details before making catalog changes.'
        }
      />

      {pageState.isLoading && <AdminProductEditPageSkeleton />}

      {!pageState.isLoading && !product && (
        <FeedbackMessage
          tone="danger"
          title="Product is unavailable"
          description={
            pageState.loadError ??
            'Refresh the page or return to admin products.'
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
                to="/admin?section=products"
                className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
              >
                Back to products
              </Link>
            </div>
          }
        />
      )}

      {!pageState.isLoading && product && (
        <AdminProductForm
          error={pageState.error}
          errorTitle="Product could not be updated"
          fieldErrors={pageState.fieldErrors}
          isSubmitting={pageState.isSubmitting}
          resetLabel="Reset changes"
          submitLabel="Save changes"
          submittingLabel="Saving..."
          successMessage={pageState.successMessage}
          values={pageState.values}
          onAddImage={pageState.onAddImage}
          onAddVariant={pageState.onAddVariant}
          onAudienceToggle={pageState.onAudienceToggle}
          onCategoryToggle={pageState.onCategoryToggle}
          onImageRemove={pageState.onImageRemove}
          onImageUpdate={pageState.onImageUpdate}
          onReset={pageState.onReset}
          onSubmit={pageState.onSubmit}
          onValueChange={pageState.onValueChange}
          onVariantRemove={pageState.onVariantRemove}
          onVariantUpdate={pageState.onVariantUpdate}
        />
      )}
    </main>
  );
};
