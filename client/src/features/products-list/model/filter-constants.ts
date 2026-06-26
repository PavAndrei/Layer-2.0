import { CategoryOption } from '../../../shared/types';
import { Filters, SortingOption } from './filter-types';

export const MINIMAL_PRICE_RANGE = 0;
export const MAXIMAL_PRICE_RANGE = 300;

export const SORTING_OPTIONS: SortingOption[] = [
  { label: 'default', value: 'default' },
  {
    label: 'price: low to high',
    value: 'price-asc',
  },
  {
    label: 'price: high to low',
    value: 'price-desc',
  },
  {
    label: 'name: A-Z',
    value: 'name-asc',
  },
  {
    label: 'name: Z-A',
    value: 'name-desc',
  },
];

export const initialFilters: Filters = {
  searchString: '',
  categories: [] as CategoryOption[],
  sizes: [],
  colors: [],
  priceRange: {
    minPrice: MINIMAL_PRICE_RANGE,
    maxPrice: MAXIMAL_PRICE_RANGE,
  },
  sortBy: {
    label: 'default',
    value: 'default',
  },
  inStockOnly: false,
  page: 1,
};
