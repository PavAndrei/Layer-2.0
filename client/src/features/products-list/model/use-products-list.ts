import { useEffect, useState } from 'react';

import type {
  ProductCardProps,
  ProductCollectionBaseFilters,
} from '../../../shared/types';
import { buildSearchParams } from '../build-search-params';
import { getProducts } from '../products-api';
import type { ProductsFilters } from './use-products-filters';

type UseProductsListParams = {
  baseFilters: ProductCollectionBaseFilters;
  filters: ProductsFilters;
};

export const useProductsList = ({
  baseFilters,
  filters,
}: UseProductsListParams) => {
  const { debouncedFilters, isDebouncing, page, setFilters } = filters;

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDebouncing) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const params = buildSearchParams({
          ...baseFilters,
          ...debouncedFilters,
        });

        const response = await getProducts(params, controller.signal);

        if (!response.success) {
          throw new Error(response.message);
        }

        const { products, pagination } = response.data;

        setProducts(products);
        setTotal(pagination.total);

        if (pagination.page !== page) {
          setFilters((prev) => ({
            ...prev,
            page: pagination.page,
          }));
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);
        setError(
          error instanceof Error ? error.message : 'Failed to load products',
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [baseFilters, debouncedFilters, isDebouncing, page, setFilters]);

  return {
    products,
    total,
    isLoading,
    error,
  };
};
