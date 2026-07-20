import { useQuery } from '@tanstack/react-query';

import { getAdminOrder } from '../api';
import { adminOrdersQueryKeys } from './admin-orders-query-keys';

const ADMIN_ORDER_STALE_TIME_MS = 1000 * 60;

export const useAdminOrder = (orderId: string | undefined) => {
  const query = useQuery({
    queryKey: orderId
      ? adminOrdersQueryKeys.detail(orderId)
      : adminOrdersQueryKeys.detail(''),
    queryFn: ({ signal }) => getAdminOrder(orderId ?? '', signal),
    enabled: Boolean(orderId),
    retry: false,
    staleTime: ADMIN_ORDER_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin order'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    order: response?.success ? response.data.order : null,
    refetch: query.refetch,
  };
};
