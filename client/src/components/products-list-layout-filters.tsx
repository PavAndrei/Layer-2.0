import type { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

import { CATEGORIES_COLLECTION } from '../constants/categories';
import {
  initialFilters,
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from '../constants/filters';
import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
} from '../constants/product-variants';
import type { CategoryOption } from '../types/category';
import type { Filters, SortingOption } from '../types/filters';
import { getActiveFilters } from '../utils/get-active-filters';
import { ProductDualPriceRange } from './product-dual-price-range';

type ProductsListLayoutFiltersProps = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  handleRemoveFilter: (filterKey: string, value?: string) => void;
  showSearch?: boolean;
  showCategories?: boolean;
  showSizes?: boolean;
  showColors?: boolean;
  showPrice?: boolean;
  showSort?: boolean;
  showInStockOnly?: boolean;
  showActiveFilters?: boolean;
  showClearButton?: boolean;
};

export const ProductsListLayoutFilters = ({
  filters,
  setFilters,
  handleRemoveFilter,
  showSearch = true,
  showCategories = true,
  showSizes = true,
  showColors = true,
  showPrice = true,
  showSort = true,
  showInStockOnly = true,
  showActiveFilters = true,
  showClearButton = true,
}: ProductsListLayoutFiltersProps) => {
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
      {showSearch && (
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

      {showCategories && (
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

      {showSizes && (
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

      {showColors && (
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

      {showPrice && (
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

      {showSort && (
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

      {showInStockOnly && (
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

      {showActiveFilters && activeFilters.length > 0 && (
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

      {showClearButton && (
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
