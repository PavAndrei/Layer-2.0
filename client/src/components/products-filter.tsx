import Select from 'react-select';
import { CategoryOption } from '../types/category';
import { CATEGORIES_COLLECTION } from '../constants/categories';
import { ProductDualPriceRange } from './product-dual-price-range';
import {
  initialFilters,
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from '../constants/filters';
import { Filters, SortingOption } from '../types/filters';
import { getActiveFilters } from '../utils/get-active-filters';
import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
} from '../constants/product-variants';

export const ProductsFilter = ({
  filters,
  setFilters,
  handleRemoveFilter,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  handleRemoveFilter: (filterKey: string, value?: string) => void;
}) => {
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

  const activeFilters = getActiveFilters(filters, initialFilters);

  return (
    <form className="flex flex-col gap-2 py-3">
      <div className="flex justify-between items-center gap-1">
        <label htmlFor="filterString" className="whitespace-nowrap">
          Search for the products:{' '}
        </label>
        <input
          className="rounded px-2 py-1 w-full border border-gray-400"
          id="filterString"
          type="text"
          placeholder="Type to filter products..."
          value={filters.searchString}
          onChange={(e) =>
            setFilters({ ...filters, searchString: e.target.value, page: 1 })
          }
        />
      </div>
      <div className="flex justify-between items-center gap-1">
        <label htmlFor="category" className="whitespace-nowrap">
          Choose a category:
        </label>

        <Select
          className="w-full"
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

      <div className="flex justify-between items-center gap-1">
        <label htmlFor="sizes" className="whitespace-nowrap">
          Choose a size:
        </label>
        <Select
          inputId="sizes"
          className="w-full"
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

      <div className="flex justify-between items-center gap-1">
        <label htmlFor="colors" className="whitespace-nowrap">
          Choose a color:
        </label>
        <Select
          inputId="colors"
          className="w-full"
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

      <ProductDualPriceRange
        min={MINIMAL_PRICE_RANGE}
        max={MAXIMAL_PRICE_RANGE}
        value={{
          minPrice: filters.priceRange.minPrice,
          maxPrice: filters.priceRange.maxPrice,
        }}
        onChange={handlePriceRangeChange}
      />

      <div className="flex justify-between items-center gap-1">
        <label className="whitespace-nowrap" htmlFor="sort">
          Sort by:{' '}
        </label>
        <Select
          className="w-full"
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

      <div className="flex items-center gap-1">
        <input
          id="inStock"
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            setFilters({ ...filters, inStockOnly: e.target.checked, page: 1 })
          }
        />
        <label htmlFor="inStock"> Show only products in stock</label>
      </div>

      <div className="flex gap-2 flex-wrap">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="flex gap-1 items-center justify-between px-3 py-1 rounded-full bg-gray-200"
          >
            <span>{filter.label}</span>
            <button
              type="button"
              onClick={() => {
                handleRemoveFilter(filter.name, filter.value);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        className="px-2 py-1 border max-w-30 rounded cursor-pointer hover:bg-gray-200 transition-colors"
        type="button"
        onClick={() => setFilters(initialFilters)}
      >
        Clear Filters
      </button>
    </form>
  );
};
