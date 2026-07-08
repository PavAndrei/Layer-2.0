import { useQuery } from '@tanstack/react-query';

import { orderQueryKeys } from '../../../entities/order';
import { getOrders } from '../api';
import type { OrdersParams } from '../api';

const ORDERS_STALE_TIME_MS = 1000 * 60;

const toOrdersSearchParams = (params: OrdersParams) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  return searchParams;
};

type UseOrdersOptions = {
  enabled?: boolean;
  params?: OrdersParams;
};

export const useOrders = ({
  enabled = true,
  params = {},
}: UseOrdersOptions = {}) => {
  const searchParams = toOrdersSearchParams(params);
  const query = useQuery({
    queryKey: orderQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getOrders(params, signal),
    enabled,
    retry: false,
    staleTime: ORDERS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load orders'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    orders: enabled && response?.success ? response.data.orders : [],
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
  };
};
