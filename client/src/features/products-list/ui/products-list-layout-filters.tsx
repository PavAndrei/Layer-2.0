import { CATEGORIES_COLLECTION } from '../../../shared/constants';
import {
  initialFilters,
  MAXIMAL_PRICE_RANGE,
  MINIMAL_PRICE_RANGE,
  SORTING_OPTIONS,
} from '../model';
import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
} from '../../../shared/constants';
import {
  Button,
  CheckboxFilter,
  DualRangeFilter,
  MultiSelectFilter,
  SelectFilter,
  TextFilter,
} from '../../../shared/ui';
import type { CategoryOption } from '../../../shared/types';
import type { UrlStateSetter } from '../../../shared/model';
import type { Filters, SortingOption } from '../model';
import { getActiveFilters } from '../helpers';

type ProductsListVisibleFilters = Partial<{
  search: boolean;
  categories: boolean;
  sizes: boolean;
  colors: boolean;
  price: boolean;
  sort: boolean;
  inStockOnly: boolean;
  hasDiscount: boolean;
  isNewProduct: boolean;
  activeFilters: boolean;
  clearButton: boolean;
}>;

type ProductsListLayoutFiltersProps = {
  filters: Filters;
  setFilters: UrlStateSetter<Filters>;
  resetFilters: () => void;
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
  hasDiscount: true,
  isNewProduct: true,
  activeFilters: true,
  clearButton: true,
} satisfies Required<ProductsListVisibleFilters>;

export const ProductsListLayoutFilters = ({
  filters,
  setFilters,
  resetFilters,
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
    <form className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      {visible.search && (
        <TextFilter
          id="filterString"
          label="Search for the products:"
          placeholder="Type to filter products..."
          value={filters.searchString}
          onChange={(searchString) =>
            setFilters({
              ...filters,
              searchString,
              page: 1,
            })
          }
        />
      )}

      {visible.categories && (
        <MultiSelectFilter
          id="category"
          label="Choose a category:"
          options={CATEGORIES_COLLECTION}
          value={filters.categories}
          onChange={(categories) =>
            setFilters({
              ...filters,
              categories: categories as CategoryOption[],
              page: 1,
            })
          }
        />
      )}

      {visible.sizes && (
        <MultiSelectFilter
          id="sizes"
          label="Choose a size:"
          options={PRODUCT_SIZE_OPTIONS}
          value={PRODUCT_SIZE_OPTIONS.filter((option) =>
            filters.sizes.includes(option.value),
          )}
          onChange={(sizes) =>
            setFilters({
              ...filters,
              sizes: sizes.map((option) => option.value),
              page: 1,
            })
          }
        />
      )}

      {visible.colors && (
        <MultiSelectFilter
          id="colors"
          label="Choose a color:"
          options={PRODUCT_COLOR_OPTIONS}
          value={PRODUCT_COLOR_OPTIONS.filter((option) =>
            filters.colors.includes(option.value),
          )}
          onChange={(colors) =>
            setFilters({
              ...filters,
              colors: colors.map((option) => option.value),
              page: 1,
            })
          }
        />
      )}

      {visible.price && (
        <DualRangeFilter
          min={MINIMAL_PRICE_RANGE}
          max={MAXIMAL_PRICE_RANGE}
          label="Choose a price range:"
          value={{
            min: filters.priceRange.minPrice,
            max: filters.priceRange.maxPrice,
          }}
          formatValue={(value) => `$${value}`}
          onChange={handlePriceRangeChange}
        />
      )}

      {visible.sort && (
        <SelectFilter
          id="sort"
          label="Sort by:"
          options={SORTING_OPTIONS as SortingOption[]}
          value={filters.sortBy}
          onChange={(sortBy) =>
            setFilters({
              ...filters,
              sortBy: sortBy ?? initialFilters.sortBy,
              page: 1,
            })
          }
        />
      )}

      {visible.inStockOnly && (
        <CheckboxFilter
          id="inStock"
          label="Show only products in stock"
          checked={filters.inStockOnly}
          onChange={(inStockOnly) =>
            setFilters({
              ...filters,
              inStockOnly,
              page: 1,
            })
          }
        />
      )}

      {visible.hasDiscount && (
        <CheckboxFilter
          id="hasDiscount"
          label="Show only sale products"
          checked={filters.hasDiscount}
          onChange={(hasDiscount) =>
            setFilters({
              ...filters,
              hasDiscount,
              page: 1,
            })
          }
        />
      )}

      {visible.isNewProduct && (
        <CheckboxFilter
          id="isNewProduct"
          label="Show only new products"
          checked={filters.isNewProduct}
          onChange={(isNewProduct) =>
            setFilters({
              ...filters,
              isNewProduct,
              page: 1,
            })
          }
        />
      )}

      {visible.activeFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center justify-between gap-1 rounded-full bg-background-primary border border-border-soft px-3 py-1"
            >
              <span className="block-medium text-typography-secondary">
                {filter.label}
              </span>
              <button
                className="cursor-pointer"
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
        <Button size="sm" variant="secondary" onClick={resetFilters}>
          Clear Filters
        </Button>
      )}
    </form>
  );
};
