import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'react-router';

import { useDebouncedValue } from '../../../shared/hooks';
import { buildSearchParams } from '../build-search-params';
import { initialFilters } from '../filter-constants';
import type { Filters } from '../filter-types';
import { parseSearchParams } from '../parse-search-params';

export type ProductsFilters = Filters & {
  debouncedFilters: Filters;
  isDebouncing: boolean;
  setFilters: Dispatch<SetStateAction<Filters>>;
  removeFilter: (filterName: string, value?: string) => void;
  handlePageChange: (page: number) => void;
};

export const useProductsFilters = (): ProductsFilters => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => {
    const parsedFilters = parseSearchParams(searchParams);

    return { ...initialFilters, ...parsedFilters };
  });

  const debouncedSearchString = useDebouncedValue(filters.searchString, 400);
  const debouncedMinPrice = useDebouncedValue(filters.priceRange.minPrice, 300);
  const debouncedMaxPrice = useDebouncedValue(filters.priceRange.maxPrice, 300);

  const debouncedFilters = useMemo<Filters>(
    () => ({
      ...filters,
      searchString: debouncedSearchString,
      priceRange: {
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
      },
    }),
    [filters, debouncedSearchString, debouncedMinPrice, debouncedMaxPrice],
  );

  const isDebouncing =
    filters.searchString !== debouncedSearchString ||
    filters.priceRange.minPrice !== debouncedMinPrice ||
    filters.priceRange.maxPrice !== debouncedMaxPrice;

  const removeFilter = useCallback(
    (filterName: string, value?: string) => {
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
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  useEffect(() => {
    setSearchParams(buildSearchParams(filters));
  }, [filters, setSearchParams]);

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      isDebouncing,
      setFilters,
      removeFilter,
      handlePageChange,
    }),
    [filters, debouncedFilters, isDebouncing, removeFilter, handlePageChange],
  );
};
