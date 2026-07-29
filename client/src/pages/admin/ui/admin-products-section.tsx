import {
  AdminProductsFiltersForm,
  AdminProductsGrid,
  AdminProductsLayout,
  AdminProductsStatCards,
} from '../../../features/admin-products';
import {
  Button,
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../../shared/ui';
import type { AdminProductsSectionState } from '../model';

const AdminProductsStatsSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-32 w-full" />
    ))}
  </div>
);

const AdminProductsGridSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-20 w-full" />
    ))}
  </div>
);

export const AdminProductsSection = ({
  filters,
  onPageChange,
  productsQuery,
}: AdminProductsSectionState) => {
  const isWaitingForInitialProducts =
    productsQuery.products.length === 0 &&
    (productsQuery.isLoading || filters.isDebouncing);

  const header = (
    <SectionHeader
      title="Products"
      description="Review catalog status, pricing, variants, stock, and recently updated products."
    />
  );
  const actions = (
    <Button disabled variant="primary">
      Add product
    </Button>
  );
  const stats = productsQuery.stats ? (
    <AdminProductsStatCards stats={productsQuery.stats} />
  ) : isWaitingForInitialProducts ? (
    <AdminProductsStatsSkeleton />
  ) : undefined;
  const productsFilters = (
    <AdminProductsFiltersForm
      audience={filters.audience}
      category={filters.category}
      color={filters.color}
      discount={filters.discount}
      search={filters.search}
      size={filters.size}
      sort={filters.sort}
      status={filters.status}
      stock={filters.stock}
      onAudienceChange={filters.handleAudienceChange}
      onCategoryChange={filters.handleCategoryChange}
      onColorChange={filters.handleColorChange}
      onDiscountChange={filters.handleDiscountChange}
      onReset={filters.resetFilters}
      onSearchChange={filters.handleSearchChange}
      onSizeChange={filters.handleSizeChange}
      onSortChange={filters.handleSortChange}
      onStatusChange={filters.handleStatusChange}
      onStockChange={filters.handleStockChange}
    />
  );

  let content = null;

  if (isWaitingForInitialProducts) {
    content = <AdminProductsGridSkeleton />;
  } else if (productsQuery.error) {
    content = (
      <FeedbackMessage
        tone="danger"
        title="Products are unavailable"
        description={productsQuery.error}
      />
    );
  } else if (productsQuery.products.length === 0) {
    content = (
      <FeedbackMessage
        title="No products found"
        description="Try changing filters or clearing them to review the catalog."
      />
    );
  } else {
    content = <AdminProductsGrid products={productsQuery.products} />;
  }

  const pagination =
    !isWaitingForInitialProducts &&
    !productsQuery.error &&
    productsQuery.products.length > 0 &&
    productsQuery.pagination ? (
      <Pagination
        currentPage={productsQuery.pagination.page}
        limit={productsQuery.pagination.limit}
        total={productsQuery.pagination.total}
        onPageChange={onPageChange}
      />
    ) : undefined;

  return (
    <AdminProductsLayout
      actions={actions}
      content={content}
      filters={productsFilters}
      header={header}
      pagination={pagination}
      stats={stats}
    />
  );
};
