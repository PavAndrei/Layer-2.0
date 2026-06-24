import { CATEGORIES_COLLECTION } from '../constants/categories';
import {
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from '../constants/filters';
import { Filters } from '../types/filters';

export const parseSearchParams = (
  searchParams: URLSearchParams,
): Partial<Filters> => {
  const searchString = searchParams.get('searchString') ?? '';

  const categories = searchParams.get('categories')?.split(',');
  const filteredCategories =
    CATEGORIES_COLLECTION.filter((c) => categories?.includes(c.value)) ?? [];

  const minPrice = Number(searchParams.get('minPrice') ?? MINIMAL_PRICE_RANGE);
  const maxPrice = Number(searchParams.get('maxPrice') ?? MAXIMAL_PRICE_RANGE);
  const priceRange = { minPrice, maxPrice };

  const sortingValuesFromUrl = searchParams.get('sortBy');
  const sortBy = SORTING_OPTIONS.find(
    (sortingOption) => sortingOption.value === sortingValuesFromUrl,
  ) ?? { label: 'default', value: 'default' };

  const inStockOnly = searchParams.get('inStockOnly') === 'true';

  const pageParam = Number(searchParams.get('page'));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  return {
    searchString,
    categories: filteredCategories,
    priceRange,
    sortBy,
    inStockOnly,
    page,
  };
};
