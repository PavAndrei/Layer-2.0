import { useState } from 'react';

import { PaginationWrapper } from '../../shared/ui';
import { ProductGrid } from './ui/product-grid';
import { ProductsListFiltersToggle } from './ui/products-list-filters-toggle';
import { ProductsListLayout } from './ui/products-list-layout';
import { ProductsListLayoutContent } from './ui/products-list-layout-content';
import { ProductsListLayoutFilters } from './ui/products-list-layout-filters';
import { ProductsListLayoutHeader } from './ui/products-list-layout-header';
import { PAGINATION, PRODUCT_COLLECTIONS } from '../../shared/constants';
import { useProductsFilters, useProductsList } from './model';

export const NewPage = () => {
  const collectionConfig = PRODUCT_COLLECTIONS.new;
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const filters = useProductsFilters();
  const { handlePageChange, page, removeFilter, setFilters } = filters;

  const { products, total, isLoading, error } = useProductsList({
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
