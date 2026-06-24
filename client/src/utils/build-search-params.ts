import { MAXIMAL_PRICE_RANGE, MINIMAL_PRICE_RANGE } from '../constants/filters';
import { PAGINATION } from '../constants/pagination';
import { Filters } from '../types/filters';

export const buildSearchParams = (
  filters: Partial<Filters>,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1) {
    params.set('page', String(filters.page));
  }

  if (filters.searchString) {
    params.set('searchString', filters.searchString);
  }

  if (filters.categories?.length) {
    params.set('categories', filters.categories.map((c) => c.value).join(','));
  }

  if (filters.sizes?.length) {
    params.set('sizes', filters.sizes.join(','));
  }

  if (filters.colors?.length) {
    params.set('colors', filters.colors.join(','));
  }

  if (filters.priceRange?.minPrice !== MINIMAL_PRICE_RANGE) {
    params.set('minPrice', String(filters.priceRange?.minPrice));
  }

  if (filters.priceRange?.maxPrice !== MAXIMAL_PRICE_RANGE) {
    params.set('maxPrice', String(filters.priceRange?.maxPrice));
  }

  if (filters.sortBy && filters.sortBy.value !== 'default') {
    params.set('sortBy', filters.sortBy.value);
  }

  if (filters.inStockOnly) {
    params.set('inStockOnly', 'true');
  }

  params.set('limit', String(PAGINATION.PRODUCTS_LIMIT));

  return params;
};
