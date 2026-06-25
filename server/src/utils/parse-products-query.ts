import type { Request } from 'express';
import { ApiError } from '../exceptions/api-error';
import {
  PRODUCT_AUDIENCES,
  type ProductAudience,
} from '../types/product-audience';
import {
  PRODUCT_SORT_VALUES,
  type ProductSort,
  type ProductsQuery,
} from '../types/products-query';
import {
  PRODUCT_SIZES,
  type ProductSize,
} from '../types/product-variant';

const readString = (value: unknown, name: string): string | undefined => {
  if (value === undefined) return undefined;

  if (typeof value !== 'string') {
    throw ApiError.BadRequest(`Invalid ${name}`);
  }

  return value.trim();
};

const readPositiveInteger = (
  value: unknown,
  name: string,
  fallback: number,
  maximum?: number,
): number => {
  const rawValue = readString(value, name);

  if (rawValue === undefined) return fallback;

  const parsedValue = Number(rawValue);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1 ||
    (maximum !== undefined && parsedValue > maximum)
  ) {
    throw ApiError.BadRequest(`Invalid ${name}`);
  }

  return parsedValue;
};

const readPrice = (value: unknown, name: string): number | undefined => {
  const rawValue = readString(value, name);

  if (rawValue === undefined) return undefined;

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw ApiError.BadRequest(`Invalid ${name}`);
  }

  return parsedValue;
};

const readBoolean = (value: unknown, name: string): boolean => {
  const rawValue = readString(value, name);

  if (rawValue === undefined || rawValue === 'false') return false;
  if (rawValue === 'true') return true;

  throw ApiError.BadRequest(`Invalid ${name}`);
};

const readCategories = (value: unknown): string[] => {
  const rawValue = readString(value, 'categories');

  if (!rawValue) return [];

  const categories = rawValue
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean);

  if (
    categories.length > 20 ||
    categories.some((category) => !/^[a-z0-9-]+$/.test(category))
  ) {
    throw ApiError.BadRequest('Invalid categories');
  }

  return [...new Set(categories)];
};

const readAudience = (value: unknown): ProductAudience[] => {
  const rawValue = readString(value, 'audience');

  if (!rawValue) return [];

  const audience = rawValue
    .split(',')
    .map((audienceItem) => audienceItem.trim())
    .filter(Boolean);

  if (
    audience.length > PRODUCT_AUDIENCES.length ||
    audience.some(
      (audienceItem) =>
        !PRODUCT_AUDIENCES.some(
          (availableAudience) => availableAudience === audienceItem,
        ),
    )
  ) {
    throw ApiError.BadRequest('Invalid audience');
  }

  return [...new Set(audience)] as ProductAudience[];
};

const readSizes = (value: unknown): ProductSize[] => {
  const rawValue = readString(value, 'sizes');

  if (!rawValue) return [];

  const sizes = rawValue
    .split(',')
    .map((size) => size.trim())
    .filter(Boolean);

  if (
    sizes.length > PRODUCT_SIZES.length ||
    sizes.some(
      (size) =>
        !PRODUCT_SIZES.some((availableSize) => availableSize === size),
    )
  ) {
    throw ApiError.BadRequest('Invalid sizes');
  }

  return [...new Set(sizes)] as ProductSize[];
};

const readColors = (value: unknown): string[] => {
  const rawValue = readString(value, 'colors');

  if (!rawValue) return [];

  const colors = rawValue
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);

  if (
    colors.length > 20 ||
    colors.some((color) => !/^[a-z0-9-]+$/.test(color))
  ) {
    throw ApiError.BadRequest('Invalid colors');
  }

  return [...new Set(colors)];
};

const readSort = (value: unknown): ProductSort | undefined => {
  const rawValue = readString(value, 'sortBy');

  if (rawValue === undefined || rawValue === 'default') return undefined;

  if (!PRODUCT_SORT_VALUES.some((sortValue) => sortValue === rawValue)) {
    throw ApiError.BadRequest('Invalid sortBy');
  }

  return rawValue as ProductSort;
};

export const parseProductsQuery = (query: Request['query']): ProductsQuery => {
  const page = readPositiveInteger(query.page, 'page', 1);
  const limit = readPositiveInteger(query.limit, 'limit', 12, 50);
  const searchString = readString(query.searchString, 'searchString');
  const audience = readAudience(query.audience);
  const categories = readCategories(query.categories);
  const sizes = readSizes(query.sizes);
  const colors = readColors(query.colors);
  const minPrice = readPrice(query.minPrice, 'minPrice');
  const maxPrice = readPrice(query.maxPrice, 'maxPrice');
  const sortBy = readSort(query.sortBy);
  const inStockOnly = readBoolean(query.inStockOnly, 'inStockOnly');
  const hasDiscount = readBoolean(query.hasDiscount, 'hasDiscount');
  const isNewProduct = readBoolean(query.isNewProduct, 'isNewProduct');

  if (searchString && searchString.length > 100) {
    throw ApiError.BadRequest('Search string is too long');
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    throw ApiError.BadRequest('minPrice cannot exceed maxPrice');
  }

  return {
    page,
    limit,
    searchString: searchString || undefined,
    audience,
    categories,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sortBy,
    inStockOnly,
    hasDiscount,
    isNewProduct,
  };
};

export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
