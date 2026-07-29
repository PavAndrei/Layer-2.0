import { useQuery } from '@tanstack/react-query';

import {
  getAdminProducts,
  type AdminProductsParams,
} from '../api';
import { adminProductsQueryKeys } from './admin-products-query-keys';
import { toAdminProductsSearchParams } from './admin-products-search-params';

const ADMIN_PRODUCTS_STALE_TIME_MS = 1000 * 60;

type UseAdminProductsOptions = {
  enabled?: boolean;
  params?: AdminProductsParams;
};

export const useAdminProducts = ({
  enabled = true,
  params = {},
}: UseAdminProductsOptions = {}) => {
  const searchParams = toAdminProductsSearchParams(params);
  const query = useQuery({
    queryKey: adminProductsQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getAdminProducts(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_PRODUCTS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin products'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    pagination: response?.success ? response.data.pagination : null,
    products: response?.success ? response.data.products : [],
    refetch: query.refetch,
    stats: response?.success ? response.data.stats : null,
  };
};
