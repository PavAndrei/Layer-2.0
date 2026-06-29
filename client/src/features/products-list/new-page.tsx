import { Button, FeedbackMessage, Pagination } from '../../shared/ui';
import { PRODUCT_COLLECTIONS } from '../../entities/product';
import {
  ProductGrid,
  ProductGridSkeleton,
  ProductsListFiltersToggle,
  ProductsListLayout,
  ProductsListLayoutContent,
  ProductsListLayoutFilters,
  ProductsListLayoutHeader,
} from './ui';
import { PAGINATION } from '../../shared/constants';
import {
  useProductsFilters,
  useProductsList,
  useProductsListUiStore,
} from './model';

export const NewPage = () => {
  const collectionConfig = PRODUCT_COLLECTIONS.new;
  const isDesktopFiltersOpen = useProductsListUiStore(
    (state) => state.isDesktopFiltersOpen,
  );
  const isMobileFiltersOpen = useProductsListUiStore(
    (state) => state.isMobileFiltersOpen,
  );
  const closeMobileFilters = useProductsListUiStore(
    (state) => state.closeMobileFilters,
  );
  const toggleDesktopFilters = useProductsListUiStore(
    (state) => state.toggleDesktopFilters,
  );
  const toggleMobileFilters = useProductsListUiStore(
    (state) => state.toggleMobileFilters,
  );

  const filters = useProductsFilters();
  const { handlePageChange, page, removeFilter, resetFilters, setFilters } =
    filters;

  const { products, total, isLoading, isFetching, error, refetch } =
    useProductsList({
      baseFilters: collectionConfig.baseFilters,
      filters,
    });

  return (
    <ProductsListLayout
      header={
        <ProductsListLayoutHeader
          title={collectionConfig.title}
          description={collectionConfig.description}
          actions={
            <ProductsListFiltersToggle
              isDesktopOpen={isDesktopFiltersOpen}
              isMobileOpen={isMobileFiltersOpen}
              onDesktopToggle={toggleDesktopFilters}
              onMobileToggle={toggleMobileFilters}
            />
          }
        />
      }
      desktopFiltersOpen={isDesktopFiltersOpen}
      mobileFiltersOpen={isMobileFiltersOpen}
      onMobileFiltersClose={closeMobileFilters}
      filters={
        <ProductsListLayoutFilters
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          handleRemoveFilter={removeFilter}
          visibleFilters={{
            hasDiscount: false,
            isNewProduct: false,
          }}
        />
      }
    >
      <ProductsListLayoutContent
        error={error}
        errorFallback={
          <FeedbackMessage
            title="Could not load products"
            description={error}
            tone="danger"
            action={
              <Button size="sm" variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        }
        emptyFallback={
          <FeedbackMessage
            title="No products found"
            description="Try changing your filters or clearing them to see more products."
          />
        }
        isFetching={isFetching}
        isLoading={isLoading}
        loadingFallback={<ProductGridSkeleton />}
        isEmpty={total === 0}
        total={total}
      >
        <ProductGrid
          products={products}
          sourceLabel={collectionConfig.title}
        />
        <Pagination
          total={total}
          limit={PAGINATION.PRODUCTS_LIMIT}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </ProductsListLayoutContent>
    </ProductsListLayout>
  );
};
