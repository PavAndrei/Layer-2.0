import { CategoryOption, type ProductSize } from '../../../entities/product';

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
  hasDiscount: boolean;
  isNewProduct: boolean;
  page: number;
};
