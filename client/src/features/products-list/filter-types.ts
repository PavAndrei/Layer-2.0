import { CategoryOption } from '../../shared/types/category-types';
import type { ProductSize } from '../../shared/types/product-variant-types';

export type SortingOption = {
  value: string;
  label: string;
};

export type Filters = {
  searchString: string;
  categories: CategoryOption[] | [];
  sizes: ProductSize[];
  colors: string[];
  priceRange: { minPrice: number; maxPrice: number };
  sortBy: SortingOption;
  inStockOnly: boolean;
  page: number;
};
