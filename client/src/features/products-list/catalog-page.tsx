import { useState } from 'react';

import { PaginationWrapper } from '../../shared/ui';
import {
  ProductGrid,
  ProductsListFiltersToggle,
  ProductsListLayout,
  ProductsListLayoutContent,
  ProductsListLayoutFilters,
  ProductsListLayoutHeader,
} from './ui';
import { PAGINATION, PRODUCT_COLLECTIONS } from '../../shared/constants';
import { useProductsFilters, useProductsList } from './model';

export const CatalogPage = () => {
  const collectionConfig = PRODUCT_COLLECTIONS.catalog;
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const filters = useProductsFilters();
  const { handlePageChange, page, removeFilter, setFilters } = filters;

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
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen((prev) => !prev)}
            />
          }
        />
      }
      filters={
        isFiltersOpen ? (
          <ProductsListLayoutFilters
            filters={filters}
            setFilters={setFilters}
            handleRemoveFilter={removeFilter}
          />
        ) : null
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
        <PaginationWrapper
          total={total}
          limit={PAGINATION.PRODUCTS_LIMIT}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </ProductsListLayoutContent>
    </ProductsListLayout>
  );
};
