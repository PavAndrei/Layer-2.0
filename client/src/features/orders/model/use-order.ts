import { useQuery } from '@tanstack/react-query';

import { orderQueryKeys } from '../../../entities/order';
import { getOrderById } from '../api';

type UseOrderOptions = {
  enabled?: boolean;
  orderId?: string;
};

export const useOrder = ({
  enabled = true,
  orderId,
}: UseOrderOptions) => {
  const query = useQuery({
    queryKey: orderQueryKeys.detail(orderId ?? ''),
    queryFn: ({ signal }) => getOrderById(orderId ?? '', signal),
    enabled: enabled && Boolean(orderId),
    retry: false,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load order'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    order: response?.success ? response.data.order : null,
    refetch: query.refetch,
  };
};
