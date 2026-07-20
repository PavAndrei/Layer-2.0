import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../../../shared/api';
import type { AdminOrderResponseData } from '../api';
import { adminOrdersQueryKeys } from './admin-orders-query-keys';

export const syncAdminOrderQueries = (
  queryClient: QueryClient,
  orderId: string,
  response: ApiResponse<AdminOrderResponseData>,
) => {
  queryClient.setQueryData<ApiResponse<AdminOrderResponseData>>(
    adminOrdersQueryKeys.detail(orderId),
    response,
  );
  queryClient.invalidateQueries({
    queryKey: adminOrdersQueryKeys.lists(),
  });
};
