import { MAXIMAL_PRICE_RANGE, MINIMAL_PRICE_RANGE } from './filter-constants';
import { PAGINATION } from '../../shared/constants/pagination-constants';
import { Filters } from './filter-types';
import type { ProductCollectionBaseFilters } from '../../shared/types/product-collection-types';

type ProductSearchParams = Partial<Filters> & ProductCollectionBaseFilters;

export const buildSearchParams = (
  filters: ProductSearchParams,
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

  if (filters.audience?.length) {
    params.set('audience', filters.audience.join(','));
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

  if (filters.hasDiscount) {
    params.set('hasDiscount', 'true');
  }

  if (filters.isNewProduct) {
    params.set('isNewProduct', 'true');
  }

  params.set('limit', String(PAGINATION.PRODUCTS_LIMIT));

  return params;
};
