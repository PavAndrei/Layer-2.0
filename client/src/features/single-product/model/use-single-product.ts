import { useQuery } from '@tanstack/react-query';

import { getProductByIdentifier } from '../api';
import { singleProductQueryKeys } from './single-product-query-keys';

export const useSingleProduct = (identifier?: string) => {
  const productQuery = useQuery({
    queryKey: singleProductQueryKeys.detail(identifier ?? ''),
    enabled: Boolean(identifier),
    queryFn: async ({ signal }) => {
      if (!identifier) {
        throw new Error('Product identifier is required');
      }

      const response = await getProductByIdentifier(identifier, signal);

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
