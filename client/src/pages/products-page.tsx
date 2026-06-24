import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { ProductCardProps } from '../types/product';
import { Filters } from '../types/filters';
import { initialFilters } from '../constants/filters';
import { ProductsFilter } from '../components/products-filter';
import { ProductGrid } from '../components/product-grid';
import { buildSearchParams } from '../utils/build-search-params';
import { parseSearchParams } from '../utils/parse-search-params';
import { PaginationWrapper } from '../components/pagination-wrapper';
import { PAGINATION } from '../constants/pagination';
import { BASE_API_URL } from '../constants/api';
import { useDebouncedValue } from '../hooks/use-debounced-value';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(() => {
    const parsedFilters = parseSearchParams(searchParams);

    return { ...initialFilters, ...parsedFilters };
  });

  const debouncedSearchString = useDebouncedValue(filters.searchString, 400);
  const debouncedPriceRange = useDebouncedValue(filters.priceRange, 300);

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
    const fetchProducts = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const params = buildSearchParams({
          page: filters.page,
          searchString: debouncedSearchString,
          categories: filters.categories,
          priceRange: debouncedPriceRange,
          sortBy: filters.sortBy,
          inStockOnly: filters.inStockOnly,
        });

        const response = await fetch(
          `${BASE_API_URL}/products?${params.toString()}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load products');
        }

        setProducts(data.products);
        setTotal(data.total);

        if (data.page !== filters.page) {
          setFilters((prev) => ({
            ...prev,
            page: data.page,
          }));
        }
      } catch (error: unknown) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : 'Failed to load products',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    debouncedSearchString,
    debouncedPriceRange,
    filters.page,
    filters.categories,
    filters.sortBy,
    filters.inStockOnly,
  ]);

  useEffect(() => {
    setSearchParams(buildSearchParams(filters));
  }, [filters, setSearchParams]);

  return (
    <div className="container mx-auto px-2.5">
      <h2>Current page: {filters.page}</h2>
      <h1 className="text-3xl font-bold capitalize">
        Welcome to the Product Filter Playground
      </h1>
      <ProductsFilter
        filters={filters}
        setFilters={setFilters}
        handleRemoveFilter={removeFilter}
      />
      {isLoading && <p>Loading...</p>}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <>
          <span>
            {total >= 1
              ? `${total} products found`
              : 'No products found. Try adjusting your filters.'}
          </span>
          <ProductGrid products={products} />
          <PaginationWrapper
            total={total}
            limit={PAGINATION.PRODUCTS_LIMIT}
            currentPage={filters.page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
