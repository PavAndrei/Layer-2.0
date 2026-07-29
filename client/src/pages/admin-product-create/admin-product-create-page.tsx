import { AdminProductCreateForm } from '../../features/admin-products';
import { SectionedPageHeader } from '../../shared/ui';
import { useAdminProductCreatePage } from './model';

const ADMIN_PRODUCT_CREATE_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Products', to: '/admin?section=products' },
  { label: 'New product' },
];

export const AdminProductCreatePage = () => {
  const pageState = useAdminProductCreatePage();

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <SectionedPageHeader
        breadcrumbs={ADMIN_PRODUCT_CREATE_BREADCRUMBS}
        title="New product"
        description="Create a catalog item with pricing, variants, stock, and ImageKit media URLs."
      />

      <AdminProductCreateForm
        error={pageState.error}
        fieldErrors={pageState.fieldErrors}
        isSubmitting={pageState.isSubmitting}
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
    </main>
  );
};
