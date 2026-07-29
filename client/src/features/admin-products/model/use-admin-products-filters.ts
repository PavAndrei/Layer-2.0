import { useCallback, useMemo } from 'react';

import {
  CATEGORIES_COLLECTION,
  PRODUCT_AUDIENCES,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_SIZES,
  PRODUCT_STATUSES,
} from '../../../entities/product';
import { useDebouncedValue } from '../../../shared/hooks';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';
import {
  ADMIN_PRODUCT_SORT_OPTIONS,
  ADMIN_PRODUCT_STOCK_FILTERS,
  type AdminProductAudienceFilterValue,
  type AdminProductCategoryFilterValue,
  type AdminProductColorFilterValue,
  type AdminProductDiscountFilterValue,
  type AdminProductSizeFilterValue,
  type AdminProductSortOption,
  type AdminProductStatusFilterValue,
  type AdminProductStockFilterValue,
} from './admin-products-filter-options';

export type AdminProductsFilters = {
  audience: AdminProductAudienceFilterValue;
  category: AdminProductCategoryFilterValue;
  color: AdminProductColorFilterValue;
  discount: AdminProductDiscountFilterValue;
  page: number;
  search: string;
  size: AdminProductSizeFilterValue;
  sort: AdminProductSortOption;
  status: AdminProductStatusFilterValue;
  stock: AdminProductStockFilterValue;
};

type AdminProductsUrlState = AdminProductsFilters & {
  section: string;
};

export type AdminProductsFiltersState = AdminProductsFilters & {
  debouncedFilters: AdminProductsFilters;
  handleAudienceChange: (audience: AdminProductsFilters['audience']) => void;
  handleCategoryChange: (category: AdminProductsFilters['category']) => void;
  handleColorChange: (color: AdminProductsFilters['color']) => void;
  handleDiscountChange: (discount: AdminProductsFilters['discount']) => void;
  handlePageChange: (page: number) => void;
  handleSearchChange: (search: string) => void;
  handleSizeChange: (size: AdminProductsFilters['size']) => void;
  handleSortChange: (sort: AdminProductsFilters['sort']) => void;
  handleStatusChange: (status: AdminProductsFilters['status']) => void;
  handleStockChange: (stock: AdminProductsFilters['stock']) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminProductsFilters: AdminProductsFilters = {
  audience: '',
  category: '',
  color: '',
  discount: '',
  page: 1,
  search: '',
  size: '',
  sort: 'default',
  status: '',
  stock: '',
};

const initialAdminProductsUrlState: AdminProductsUrlState = {
  ...initialAdminProductsFilters,
  section: '',
};

const ADMIN_PRODUCTS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  search: stringParam({ name: 'search' }),
  status: customParam<AdminProductsFilters['status']>({
    parse: (searchParams) => {
      const status = searchParams.get('status');

      return (
        PRODUCT_STATUSES.find((productStatus) => productStatus === status) ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('status');
        return;
      }

      searchParams.set('status', value);
    },
  }),
  category: customParam<AdminProductsFilters['category']>({
    parse: (searchParams) => {
      const category = searchParams.get('category');

      return (
        CATEGORIES_COLLECTION.find((option) => option.value === category)
          ?.value ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('category');
        return;
      }

      searchParams.set('category', value);
    },
  }),
  audience: customParam<AdminProductsFilters['audience']>({
    parse: (searchParams) => {
      const audience = searchParams.get('audience');

      return (
        PRODUCT_AUDIENCES.find(
          (productAudience) => productAudience === audience,
        ) ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('audience');
        return;
      }

      searchParams.set('audience', value);
    },
  }),
  stock: customParam<AdminProductsFilters['stock']>({
    parse: (searchParams) => {
      const stock = searchParams.get('stock');

      return (
        ADMIN_PRODUCT_STOCK_FILTERS.find(
          (stockFilter) => stockFilter === stock,
        ) ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('stock');
        return;
      }

      searchParams.set('stock', value);
    },
  }),
  discount: customParam<AdminProductsFilters['discount']>({
    parse: (searchParams) => {
      const hasDiscount = searchParams.get('hasDiscount');

      if (hasDiscount === 'true') return 'discounted';
      if (hasDiscount === 'false') return 'not-discounted';

      return '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('hasDiscount');
        return;
      }

      searchParams.set(
        'hasDiscount',
        value === 'discounted' ? 'true' : 'false',
      );
    },
  }),
  color: customParam<AdminProductsFilters['color']>({
    parse: (searchParams) => {
      const color = searchParams.get('color');

      return (
        PRODUCT_COLOR_OPTIONS.find((option) => option.value === color)
          ?.value ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('color');
        return;
      }

      searchParams.set('color', value);
    },
  }),
  size: customParam<AdminProductsFilters['size']>({
    parse: (searchParams) => {
      const size = searchParams.get('size');

      return PRODUCT_SIZES.find((productSize) => productSize === size) ?? '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('size');
        return;
      }

      searchParams.set('size', value);
    },
  }),
  sort: customParam<AdminProductsFilters['sort']>({
    parse: (searchParams) => {
      const sort = searchParams.get('sort');

      return (
        ADMIN_PRODUCT_SORT_OPTIONS.find((sortOption) => sortOption === sort) ??
        initialAdminProductsFilters.sort
      );
    },
    serialize: (searchParams, value) => {
      if (value === initialAdminProductsFilters.sort) {
        searchParams.delete('sort');
        return;
      }

      searchParams.set('sort', value);
    },
  }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminProductsFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  audience,
  category,
  color,
  discount,
  page,
  search,
  size,
  sort,
  status,
  stock,
}: AdminProductsUrlState): AdminProductsFilters => ({
  audience,
  category,
  color,
  discount,
  page,
  search,
  size,
  sort,
  status,
  stock,
});

export const useAdminProductsFilters = (): AdminProductsFiltersState => {
  const [urlState, setUrlState] = useUrlState<AdminProductsUrlState>(
    ADMIN_PRODUCTS_FILTERS_URL_SCHEMA,
    { replace: true },
  );

  const filters = useMemo(() => toFilters(urlState), [urlState]);

  const setFilters = useCallback<UrlStateSetter<AdminProductsFilters>>(
    (value, options) => {
      setUrlState((prev) => {
        const previousFilters = toFilters(prev);
        const nextFilters =
          typeof value === 'function'
            ? (value as (state: AdminProductsFilters) => AdminProductsFilters)(
              previousFilters,
            )
            : value;

        return {
          ...prev,
          ...nextFilters,
        };
      }, options);
    },
    [setUrlState],
  );

  const debouncedSearch = useDebouncedValue(filters.search, 400);

  const debouncedFilters = useMemo<AdminProductsFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters],
  );

  const isDebouncing = filters.search !== debouncedSearch;

  const resetFilters = useCallback(() => {
    setUrlState(
      (prev) => ({
        ...initialAdminProductsUrlState,
        section: prev.section,
      }),
      { replace: true },
    );
  }, [setUrlState]);

  const updateFilter = useCallback(
    <Key extends keyof AdminProductsFilters>(
      field: Key,
      value: AdminProductsFilters[Key],
    ) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [field]: value,
      }));
    },
    [setFilters],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters(
        (prev) => ({
          ...prev,
          page,
        }),
        { replace: false },
      );
    },
    [setFilters],
  );

  const syncPage = useCallback(
    (page: number) => {
      setFilters((prev) => ({
        ...prev,
        page,
      }));
    },
    [setFilters],
  );

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      handleAudienceChange: (audience: AdminProductsFilters['audience']) =>
        updateFilter('audience', audience),
      handleCategoryChange: (category: AdminProductsFilters['category']) =>
        updateFilter('category', category),
      handleColorChange: (color: AdminProductsFilters['color']) =>
        updateFilter('color', color),
      handleDiscountChange: (discount: AdminProductsFilters['discount']) =>
        updateFilter('discount', discount),
      handlePageChange,
      handleSearchChange: (search: string) =>
        updateFilter('search', search),
      handleSizeChange: (size: AdminProductsFilters['size']) =>
        updateFilter('size', size),
      handleSortChange: (sort: AdminProductsFilters['sort']) =>
        updateFilter('sort', sort),
      handleStatusChange: (status: AdminProductsFilters['status']) =>
        updateFilter('status', status),
      handleStockChange: (stock: AdminProductsFilters['stock']) =>
        updateFilter('stock', stock),
      isDebouncing,
      resetFilters,
      syncPage,
    }),
    [
      debouncedFilters,
      filters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      syncPage,
      updateFilter,
    ],
  );
};
