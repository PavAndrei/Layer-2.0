import { CategoryOption } from './category';
import type { ProductSize } from './product-variant';

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
