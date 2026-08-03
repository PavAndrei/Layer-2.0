import { useMemo, useState } from 'react';
import {
  useQueries,
  useQuery,
} from '@tanstack/react-query';

import {
  getAdminBlogRelatedProduct,
  getAdminBlogRelatedProducts,
} from '../api';
import type { AdminBlogRelatedProductOption } from '../api';
import { useDebouncedValue } from '../../../shared/hooks';
import { adminBlogPostsQueryKeys } from './admin-blog-posts-query-keys';

const ADMIN_BLOG_RELATED_PRODUCTS_LIMIT = 8;
const ADMIN_BLOG_RELATED_PRODUCTS_MIN_SEARCH_LENGTH = 2;
const ADMIN_BLOG_RELATED_PRODUCTS_STALE_TIME_MS = 1000 * 60;

type UseAdminBlogRelatedProductsOptions = {
  selectedProductIds: string[];
};

const getResponseError = (response: unknown) => {
  if (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    response.success === false &&
    'message' in response &&
    typeof response.message === 'string'
  ) {
    return response.message;
  }

  return null;
};

export const useAdminBlogRelatedProducts = ({
  selectedProductIds,
}: UseAdminBlogRelatedProductsOptions) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const canSearch =
    debouncedSearch.length >= ADMIN_BLOG_RELATED_PRODUCTS_MIN_SEARCH_LENGTH;
  const searchParams = useMemo(
    () =>
      new URLSearchParams({
        limit: String(ADMIN_BLOG_RELATED_PRODUCTS_LIMIT),
        page: '1',
        search: debouncedSearch,
        status: 'active',
      }),
    [debouncedSearch],
  );
  const searchQuery = useQuery({
    queryKey: adminBlogPostsQueryKeys.relatedProducts(
      searchParams.toString(),
    ),
    queryFn: ({ signal }) =>
      getAdminBlogRelatedProducts(
        {
          limit: ADMIN_BLOG_RELATED_PRODUCTS_LIMIT,
          page: 1,
          search: debouncedSearch || undefined,
          status: 'active',
        },
        signal,
      ),
    enabled: canSearch,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_BLOG_RELATED_PRODUCTS_STALE_TIME_MS,
  });
  const selectedProductQueries = useQueries({
    queries: selectedProductIds.map((productId) => ({
      queryKey: adminBlogPostsQueryKeys.relatedProduct(productId),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getAdminBlogRelatedProduct(productId, signal),
      retry: false,
      staleTime: ADMIN_BLOG_RELATED_PRODUCTS_STALE_TIME_MS,
    })),
  });
  const selectedProducts = useMemo(() => {
    const productById = new Map<string, AdminBlogRelatedProductOption>();

    selectedProductQueries.forEach((query) => {
      const response = query.data;

      if (response?.success) {
        productById.set(response.data.product._id, response.data.product);
      }
    });

    return selectedProductIds.map((productId) => ({
      product: productById.get(productId) ?? null,
      productId,
    }));
  }, [
    selectedProductIds,
    selectedProductQueries,
  ]);
  const searchProducts = useMemo(() => {
    if (!searchQuery.data?.success) return [];

    const selectedProductIdSet = new Set(selectedProductIds);

    return searchQuery.data.data.products.filter(
      (product) => !selectedProductIdSet.has(product._id),
    );
  }, [
    searchQuery.data,
    selectedProductIds,
  ]);
  const selectedProductsError = selectedProductQueries
    .map((query) => getResponseError(query.data))
    .find(Boolean);
  const searchError =
    getResponseError(searchQuery.data) ??
    (searchQuery.error instanceof Error
      ? searchQuery.error.message
      : searchQuery.error
        ? 'Failed to load related product options'
        : null);

  return {
    isSearchFetching: searchQuery.isFetching,
    isSelectedProductsFetching: selectedProductQueries.some(
      (query) => query.isFetching,
    ),
    search,
    searchMinLength: ADMIN_BLOG_RELATED_PRODUCTS_MIN_SEARCH_LENGTH,
    searchError,
    searchProducts,
    shouldShowSearchResults: canSearch,
    selectedProducts,
    selectedProductsError,
    setSearch,
  };
};
