import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { ProductCollectionBaseFilters } from '../../../shared/types';
import { buildSearchParams } from '../build-search-params';
import { getProducts } from '../products-api';
import type { ProductsFilters } from './use-products-filters';

type UseProductsListParams = {
  baseFilters: ProductCollectionBaseFilters;
  filters: ProductsFilters;
};

export const useProductsList = ({
  baseFilters,
  filters,
}: UseProductsListParams) => {
  const { debouncedFilters, isDebouncing, page, setFilters } = filters;

  const params = useMemo(() => {
    return buildSearchParams({
      ...baseFilters,
      ...debouncedFilters,
    });
  }, [baseFilters, debouncedFilters]);

  const productsQuery = useQuery({
    queryKey: ['products-list', params.toString()],
    queryFn: ({ signal }) => getProducts(params, signal),
    enabled: !isDebouncing,
  });

  const response = productsQuery.data;

  useEffect(() => {
    if (!response?.success) return;

    const { pagination } = response.data;

    if (pagination.page !== page) {
      setFilters((prev) => ({
        ...prev,
        page: pagination.page,
      }));
    }
  }, [page, response, setFilters]);

  const products = response?.success ? response.data.products : [];
  const total = response?.success ? response.data.pagination.total : 0;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    productsQuery.error instanceof Error
      ? productsQuery.error.message
      : productsQuery.error
        ? 'Failed to load products'
        : null;

  return {
    products,
    total,
    isLoading: productsQuery.isLoading,
    error: responseError ?? queryError,
  };
};
