import type { QueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import type { ApiResponse } from '../../../shared/api';
import type {
  AdminProductResponseData,
  DeleteAdminProductResponseData,
} from '../api';
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

export const syncDeletedAdminProductQueries = (
  queryClient: QueryClient,
  response: ApiResponse<DeleteAdminProductResponseData>,
) => {
  if (!response.success) return;

  const { productId } = response.data;

  queryClient.removeQueries({
    queryKey: adminProductsQueryKeys.detail(productId),
  });

  queryClient.invalidateQueries({
    queryKey: adminProductsQueryKeys.lists(),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.product(productId),
  });
};
