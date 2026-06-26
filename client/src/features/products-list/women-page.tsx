import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { getProducts } from './products-api';
import { PaginationWrapper } from '../../shared/ui/pagination-wrapper';
import { ProductGrid } from './ui/product-grid';
import { ProductsListFiltersToggle } from './ui/products-list-filters-toggle';
import { ProductsListLayout } from './ui/products-list-layout';
import { ProductsListLayoutContent } from './ui/products-list-layout-content';
import { ProductsListLayoutFilters } from './ui/products-list-layout-filters';
import { ProductsListLayoutHeader } from './ui/products-list-layout-header';
import { initialFilters } from './filter-constants';
import { PAGINATION } from '../../shared/constants/pagination-constants';
import { PRODUCT_COLLECTIONS } from '../../shared/constants/product-collection-constants';
import { useDebouncedValue } from '../../shared/hooks/use-debounced-value';
import type { Filters } from './filter-types';
import type { ProductCardProps } from '../../shared/types/product-types';
import { buildSearchParams } from './build-search-params';
import { parseSearchParams } from './parse-search-params';

export const WomenPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionConfig = PRODUCT_COLLECTIONS.women;
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(() => {
    const parsedFilters = parseSearchParams(searchParams);

    return { ...initialFilters, ...parsedFilters };
  });

  const debouncedSearchString = useDebouncedValue(filters.searchString, 400);
  const debouncedMinPrice = useDebouncedValue(filters.priceRange.minPrice, 300);
  const debouncedMaxPrice = useDebouncedValue(filters.priceRange.maxPrice, 300);

  const isDebouncing =
    filters.searchString !== debouncedSearchString ||
    filters.priceRange.minPrice !== debouncedMinPrice ||
    filters.priceRange.maxPrice !== debouncedMaxPrice;

  const removeFilter = (filterName: string, value?: string) => {
    if (filterName === 'categories' && value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        categories: prev.categories.filter(
          (category) => category.value !== value,
        ),
      }));

      return;
    }

    if (filterName === 'sizes' && value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        sizes: prev.sizes.filter((size) => size !== value),
      }));

      return;
    }

    if (filterName === 'colors' && value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        colors: prev.colors.filter((color) => color !== value),
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      page: 1,
      [filterName]: initialFilters[filterName as keyof Filters],
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    if (isDebouncing) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const params = buildSearchParams({
          ...collectionConfig.baseFilters,
          page: filters.page,
          searchString: debouncedSearchString,
          categories: filters.categories,
          sizes: filters.sizes,
          colors: filters.colors,
          priceRange: {
            minPrice: debouncedMinPrice,
            maxPrice: debouncedMaxPrice,
          },
          sortBy: filters.sortBy,
          inStockOnly: filters.inStockOnly,
        });

        const response = await getProducts(params, controller.signal);

        if (!response.success) {
          throw new Error(response.message);
        }

        const { products, pagination } = response.data;

        setProducts(products);
        setTotal(pagination.total);

        if (pagination.page !== filters.page) {
          setFilters((prev) => ({
            ...prev,
            page: pagination.page,
          }));
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);
        setError(
          error instanceof Error ? error.message : 'Failed to load products',
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [
    isDebouncing,
    debouncedSearchString,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.page,
    filters.categories,
    filters.sizes,
    filters.colors,
    filters.sortBy,
    filters.inStockOnly,
    collectionConfig.baseFilters,
  ]);

  useEffect(() => {
    setSearchParams(buildSearchParams(filters));
  }, [filters, setSearchParams]);

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
          currentPage={filters.page}
          onPageChange={handlePageChange}
        />
      </ProductsListLayoutContent>
    </ProductsListLayout>
  );
};
