import { useQuery } from '@tanstack/react-query';

import { getAdminProduct } from '../api';
import { adminProductsQueryKeys } from './admin-products-query-keys';

const ADMIN_PRODUCT_STALE_TIME_MS = 1000 * 60;

export const useAdminProduct = (productId: string | undefined) => {
  const query = useQuery({
    queryKey: productId
      ? adminProductsQueryKeys.detail(productId)
      : adminProductsQueryKeys.detail(''),
    queryFn: ({ signal }) => getAdminProduct(productId ?? '', signal),
    enabled: Boolean(productId),
    retry: false,
    staleTime: ADMIN_PRODUCT_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin product'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    product: response?.success ? response.data.product : null,
    refetch: query.refetch,
  };
};
