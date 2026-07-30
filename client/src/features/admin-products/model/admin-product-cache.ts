import type { QueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '../../../entities/review';
import { adminDashboardQueryKeys } from '../../admin-dashboard';
import { adminReviewsQueryKeys } from '../../admin-reviews';
import { favoritesQueryKeys } from '../../favorites';
import { productsListQueryKeys } from '../../products-list';
import { singleProductQueryKeys } from '../../single-product';
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

  const { productId, slug } = response.data;

  queryClient.removeQueries({
    queryKey: adminProductsQueryKeys.detail(productId),
  });
  queryClient.removeQueries({
    queryKey: singleProductQueryKeys.detail(productId),
  });
  queryClient.removeQueries({
    queryKey: singleProductQueryKeys.detail(slug),
  });

  queryClient.invalidateQueries({
    queryKey: adminProductsQueryKeys.lists(),
  });
  queryClient.invalidateQueries({
    queryKey: adminReviewsQueryKeys.all,
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.product(productId),
  });
  queryClient.invalidateQueries({
    queryKey: reviewQueryKeys.userScoped(),
  });
  queryClient.invalidateQueries({
    queryKey: favoritesQueryKeys.all,
  });
  queryClient.invalidateQueries({
    queryKey: productsListQueryKeys.all,
  });
  queryClient.invalidateQueries({
    queryKey: singleProductQueryKeys.all,
  });
  queryClient.invalidateQueries({
    queryKey: adminDashboardQueryKeys.all,
  });
};
