import type { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

import { CATEGORIES_COLLECTION } from '../../../shared/constants/category-constants';
import {
  initialFilters,
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from '../filter-constants';
import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
} from '../../../shared/constants/product-variant-constants';
import type { CategoryOption } from '../../../shared/types/category-types';
import type { Filters, SortingOption } from '../filter-types';
import { getActiveFilters } from '../get-active-filters';
import { ProductDualPriceRange } from './product-dual-price-range';

type ProductsListVisibleFilters = Partial<{
  search: boolean;
  categories: boolean;
  sizes: boolean;
  colors: boolean;
  price: boolean;
  sort: boolean;
  inStockOnly: boolean;
  activeFilters: boolean;
  clearButton: boolean;
}>;

type ProductsListLayoutFiltersProps = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  handleRemoveFilter: (filterKey: string, value?: string) => void;
  visibleFilters?: ProductsListVisibleFilters;
};

const DEFAULT_VISIBLE_FILTERS = {
  search: true,
  categories: true,
  sizes: true,
  colors: true,
  price: true,
  sort: true,
  inStockOnly: true,
  activeFilters: true,
  clearButton: true,
} satisfies Required<ProductsListVisibleFilters>;

export const ProductsListLayoutFilters = ({
  filters,
  setFilters,
  handleRemoveFilter,
  visibleFilters,
}: ProductsListLayoutFiltersProps) => {
  const visible = {
    ...DEFAULT_VISIBLE_FILTERS,
    ...visibleFilters,
  };
  const activeFilters = getActiveFilters(filters, initialFilters);

  const handlePriceRangeChange = (values: { min: number; max: number }) => {
    setFilters({
      ...filters,
      page: 1,
      priceRange: {
        minPrice: values.min,
        maxPrice: values.max,
      },
    });
  };

  return (
    <form className="flex flex-col gap-4 rounded border border-gray-200 p-4">
      {visible.search && (
        <div className="flex flex-col gap-1">
          <label htmlFor="filterString">Search for the products:</label>
          <input
            className="w-full rounded border border-gray-400 px-2 py-1"
            id="filterString"
            type="text"
            placeholder="Type to filter products..."
            value={filters.searchString}
            onChange={(e) =>
              setFilters({
                ...filters,
                searchString: e.target.value,
                page: 1,
              })
            }
          />
        </div>
      )}

      {visible.categories && (
        <div className="flex flex-col gap-1">
          <label htmlFor="category">Choose a category:</label>
          <Select
            inputId="category"
            options={CATEGORIES_COLLECTION}
            isMulti
            value={filters.categories}
            onChange={(newValue) =>
              setFilters({
                ...filters,
                categories: newValue as CategoryOption[],
                page: 1,
              })
            }
          />
        </div>
      )}

      {visible.sizes && (
        <div className="flex flex-col gap-1">
          <label htmlFor="sizes">Choose a size:</label>
          <Select
            inputId="sizes"
            options={PRODUCT_SIZE_OPTIONS}
            isMulti
            value={PRODUCT_SIZE_OPTIONS.filter((option) =>
              filters.sizes.includes(option.value),
            )}
            onChange={(newValue) =>
              setFilters({
                ...filters,
                sizes: newValue.map((option) => option.value),
                page: 1,
              })
            }
          />
        </div>
      )}

      {visible.colors && (
        <div className="flex flex-col gap-1">
          <label htmlFor="colors">Choose a color:</label>
          <Select
            inputId="colors"
            options={PRODUCT_COLOR_OPTIONS}
            isMulti
            value={PRODUCT_COLOR_OPTIONS.filter((option) =>
              filters.colors.includes(option.value),
            )}
            onChange={(newValue) =>
              setFilters({
                ...filters,
                colors: newValue.map((option) => option.value),
                page: 1,
              })
            }
          />
        </div>
      )}

      {visible.price && (
        <ProductDualPriceRange
          min={MINIMAL_PRICE_RANGE}
          max={MAXIMAL_PRICE_RANGE}
          value={{
            minPrice: filters.priceRange.minPrice,
            maxPrice: filters.priceRange.maxPrice,
          }}
          onChange={handlePriceRangeChange}
        />
      )}

      {visible.sort && (
        <div className="flex flex-col gap-1">
          <label htmlFor="sort">Sort by:</label>
          <Select
            inputId="sort"
            options={SORTING_OPTIONS as SortingOption[]}
            value={filters.sortBy}
            onChange={(newValue) =>
              setFilters({
                ...filters,
                sortBy: newValue as SortingOption,
                page: 1,
              })
            }
          />
        </div>
      )}

      {visible.inStockOnly && (
        <div className="flex items-center gap-1">
          <input
            id="inStock"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters({
                ...filters,
                inStockOnly: e.target.checked,
                page: 1,
              })
            }
          />
          <label htmlFor="inStock">Show only products in stock</label>
        </div>
      )}

      {visible.activeFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center justify-between gap-1 rounded-full bg-gray-200 px-3 py-1"
            >
              <span>{filter.label}</span>
              <button
                type="button"
                aria-label={`Remove ${filter.label}`}
                onClick={() => {
                  handleRemoveFilter(filter.name, filter.value);
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {visible.clearButton && (
        <button
          className="max-w-30 cursor-pointer rounded border px-2 py-1 transition-colors hover:bg-gray-200"
          type="button"
          onClick={() => setFilters(initialFilters)}
        >
          Clear Filters
        </button>
      )}
    </form>
  );
};
