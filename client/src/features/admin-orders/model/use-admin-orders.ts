import { useQuery } from '@tanstack/react-query';

import {
  getAdminOrders,
  type AdminOrdersParams,
} from '../api';
import { adminOrdersQueryKeys } from './admin-orders-query-keys';
import { toAdminOrdersSearchParams } from './admin-orders-search-params';

const ADMIN_ORDERS_STALE_TIME_MS = 1000 * 60;

type UseAdminOrdersOptions = {
  enabled?: boolean;
  params?: AdminOrdersParams;
};

export const useAdminOrders = ({
  enabled = true,
  params = {},
}: UseAdminOrdersOptions = {}) => {
  const searchParams = toAdminOrdersSearchParams(params);
  const query = useQuery({
    queryKey: adminOrdersQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getAdminOrders(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_ORDERS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin orders'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    orders: response?.success ? response.data.orders : [],
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
  };
};
