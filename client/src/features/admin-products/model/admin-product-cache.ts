import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../../../shared/api';
import type { AdminProductResponseData } from '../api';
import { adminProductsQueryKeys } from './admin-products-query-keys';

export const syncAdminProductQueries = (
  queryClient: QueryClient,
  productId: string,
  response: ApiResponse<AdminProductResponseData>,
) => {
  queryClient.setQueryData<ApiResponse<AdminProductResponseData>>(
    adminProductsQueryKeys.detail(productId),
    response,
  );
  queryClient.invalidateQueries({
    queryKey: adminProductsQueryKeys.lists(),
  });
};
