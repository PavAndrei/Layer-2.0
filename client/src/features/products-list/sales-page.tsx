import { Pagination } from '../../shared/ui';
import {
  ProductGrid,
  ProductsListFiltersToggle,
  ProductsListLayout,
  ProductsListLayoutContent,
  ProductsListLayoutFilters,
  ProductsListLayoutHeader,
} from './ui';
import { PAGINATION, PRODUCT_COLLECTIONS } from '../../shared/constants';
import {
  useProductsFilters,
  useProductsList,
  useProductsListUiStore,
} from './model';

export const SalesPage = () => {
  const collectionConfig = PRODUCT_COLLECTIONS.sales;
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
        errorAction={
          <button
            type="button"
            className="max-w-30 cursor-pointer rounded border px-2 py-1 transition-colors hover:bg-gray-200"
            onClick={() => refetch()}
          >
            Try again
          </button>
        }
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={total === 0}
        total={total}
      >
        <ProductGrid products={products} />
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
