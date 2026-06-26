import { useQuery } from '@tanstack/react-query';

import { getProductById } from '../api';
import { singleProductQueryKeys } from './single-product-query-keys';

export const useSingleProduct = (id?: string) => {
  const productQuery = useQuery({
    queryKey: singleProductQueryKeys.detail(id ?? ''),
    enabled: Boolean(id),
    queryFn: async ({ signal }) => {
      if (!id) {
        throw new Error('Product id is required');
      }

      const response = await getProductById(id, signal);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  return {
    product: productQuery.data?.product ?? null,
    relatedProducts: productQuery.data?.relatedProducts ?? [],
    isLoading: productQuery.isLoading,
    error:
      productQuery.error instanceof Error
        ? productQuery.error.message
        : productQuery.error
          ? 'Failed to load product'
          : null,
  };
};
