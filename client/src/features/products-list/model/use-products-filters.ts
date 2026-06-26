import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useDebouncedValue } from '../../../shared/hooks';
import {
  booleanParam,
  customParam,
  numberParam,
  stringParam,
  useUrlState,
} from '../../../shared/model';
import {
  CATEGORIES_COLLECTION,
  PRODUCT_COLOR_OPTIONS,
} from '../../../shared/constants';
import {
  initialFilters,
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from './filter-constants';
import type { Filters, SortingOption } from './filter-types';
import { PRODUCT_SIZES } from '../../../shared/types';

export type ProductsFilters = Filters & {
  debouncedFilters: Filters;
  isDebouncing: boolean;
  setFilters: Dispatch<SetStateAction<Filters>>;
  removeFilter: (filterName: string, value?: string) => void;
  handlePageChange: (page: number) => void;
};

const PRODUCT_FILTERS_URL_SCHEMA = {
  searchString: stringParam({ name: 'searchString' }),
  categories: customParam<Filters['categories']>({
    parse: (searchParams) => {
      const categories = searchParams.get('categories')?.split(',');

      return CATEGORIES_COLLECTION.filter((category) =>
        categories?.includes(category.value),
      );
    },
    serialize: (searchParams, value) => {
      if (value.length === 0) {
        searchParams.delete('categories');
        return;
      }

      searchParams.set(
        'categories',
        value.map((category) => category.value).join(','),
      );
    },
  }),
  sizes: customParam<Filters['sizes']>({
    parse: (searchParams) => {
      const sizes = searchParams.get('sizes')?.split(',');

      return PRODUCT_SIZES.filter((size) => sizes?.includes(size));
    },
    serialize: (searchParams, value) => {
      if (value.length === 0) {
        searchParams.delete('sizes');
        return;
      }

      searchParams.set('sizes', value.join(','));
    },
  }),
  colors: customParam<Filters['colors']>({
    parse: (searchParams) => {
      const colors = searchParams.get('colors')?.split(',');

      return PRODUCT_COLOR_OPTIONS.filter((color) =>
        colors?.includes(color.value),
      ).map((color) => color.value);
    },
    serialize: (searchParams, value) => {
      if (value.length === 0) {
        searchParams.delete('colors');
        return;
      }

      searchParams.set('colors', value.join(','));
    },
  }),
  priceRange: customParam<Filters['priceRange']>({
    parse: (searchParams) => {
      const minPrice = Number(
        searchParams.get('minPrice') ?? MINIMAL_PRICE_RANGE,
      );
      const maxPrice = Number(
        searchParams.get('maxPrice') ?? MAXIMAL_PRICE_RANGE,
      );

      return {
        minPrice: Number.isFinite(minPrice) ? minPrice : MINIMAL_PRICE_RANGE,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : MAXIMAL_PRICE_RANGE,
      };
    },
    serialize: (searchParams, value) => {
      if (value.minPrice === MINIMAL_PRICE_RANGE) {
        searchParams.delete('minPrice');
      } else {
        searchParams.set('minPrice', String(value.minPrice));
      }

      if (value.maxPrice === MAXIMAL_PRICE_RANGE) {
        searchParams.delete('maxPrice');
      } else {
        searchParams.set('maxPrice', String(value.maxPrice));
      }
    },
  }),
  sortBy: customParam<SortingOption>({
    parse: (searchParams) => {
      const sortBy = searchParams.get('sortBy');

      return (
        SORTING_OPTIONS.find((sortingOption) => sortingOption.value === sortBy) ??
        initialFilters.sortBy
      );
    },
    serialize: (searchParams, value) => {
      if (value.value === initialFilters.sortBy.value) {
        searchParams.delete('sortBy');
        return;
      }

      searchParams.set('sortBy', value.value);
    },
  }),
  inStockOnly: booleanParam({ name: 'inStockOnly' }),
  page: numberParam({
    name: 'page',
    defaultValue: 1,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

export const useProductsFilters = (): ProductsFilters => {
  const [filters, setFilters] = useUrlState<Filters>(
    PRODUCT_FILTERS_URL_SCHEMA,
    { replace: true },
  );

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
    [setFilters],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, [setFilters]);

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      isDebouncing,
      setFilters,
      removeFilter,
      handlePageChange,
    }),
    [
      filters,
      debouncedFilters,
      isDebouncing,
      setFilters,
      removeFilter,
      handlePageChange,
    ],
  );
};
