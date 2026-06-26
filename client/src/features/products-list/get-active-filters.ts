import { Filters } from './filter-types';

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

  if (filters.sizes.length > 0) {
    filters.sizes.forEach((size) => {
      activeFilters.push({
        key: `size-${size}`,
        name: 'sizes',
        value: size,
        label: `Size: ${size === 'ONE_SIZE' ? 'One size' : size}`,
      });
    });
  }

  if (filters.colors.length > 0) {
    filters.colors.forEach((color) => {
      activeFilters.push({
        key: `color-${color}`,
        name: 'colors',
        value: color,
        label: `Color: ${color.replace(/-/g, ' ')}`,
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
