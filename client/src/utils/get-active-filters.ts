import { Filters } from '../types/filters';

export const getActiveFilters = (filters: Filters, initialFilters: Filters) => {
  const activeFilters = [];

  if (filters.searchString !== initialFilters.searchString) {
    activeFilters.push({
      key: 'search',
      name: 'searchString',
      label: `Search: ${filters.searchString}`,
      value: filters.searchString,
    });
  }

  if (filters.categories.length > 0) {
    filters.categories.forEach((category) => {
      activeFilters.push({
        key: `category-${category.value}`,
        name: 'categories',
        value: category.value,
        label: category.label,
      });
    });
  }

  if (
    filters.priceRange.minPrice !== initialFilters.priceRange.minPrice ||
    filters.priceRange.maxPrice !== initialFilters.priceRange.maxPrice
  ) {
    activeFilters.push({
      key: 'price',
      name: 'priceRange',
      label: `$${filters.priceRange.minPrice} - $${filters.priceRange.maxPrice}`,
      value: `${filters.priceRange.minPrice}-${filters.priceRange.maxPrice}`,
    });
  }

  if (filters.sortBy && filters.sortBy.value !== initialFilters.sortBy.value) {
    activeFilters.push({
      key: 'sort',
      name: 'sortBy',
      label: `Sort by: ${filters.sortBy.label}`,
      value: filters.sortBy.value,
    });
  }

  if (filters.inStockOnly) {
    activeFilters.push({
      key: 'stock',
      name: 'inStockOnly',
      label: 'In Stock',
      value: 'true',
    });
  }

  return activeFilters;
};
