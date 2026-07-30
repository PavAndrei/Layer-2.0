import { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { adminDashboardQueryKeys } from '../../../features/admin-dashboard';
import {
  type DeleteAdminProductResponseData,
  useAdminProducts,
  useAdminProductsFilters,
} from '../../../features/admin-products';
import { adminReviewsQueryKeys } from '../../../features/admin-reviews';
import { favoritesQueryKeys } from '../../../features/favorites';
import { productsListQueryKeys } from '../../../features/products-list';
import { singleProductQueryKeys } from '../../../features/single-product';
import type { AdminSection } from '../../../features/admin';
import { reviewQueryKeys } from '../../../entities/review';

const ADMIN_PRODUCTS_PAGE_LIMIT = 12;

type UseAdminProductsSectionParams = {
  activeSection: AdminSection;
};

const toDiscountParam = (
  value: ReturnType<typeof useAdminProductsFilters>['discount'],
) => {
  if (value === 'discounted') return true;
  if (value === 'not-discounted') return false;

  return undefined;
};

export const useAdminProductsSection = ({
  activeSection,
}: UseAdminProductsSectionParams) => {
  const queryClient = useQueryClient();
  const filters = useAdminProductsFilters();
  const {
    debouncedFilters,
    handlePageChange,
    isDebouncing,
    page,
    syncPage,
  } = filters;

  const params = useMemo(
    () => ({
      audience: debouncedFilters.audience || undefined,
      category: debouncedFilters.category || undefined,
      color: debouncedFilters.color || undefined,
      hasDiscount: toDiscountParam(debouncedFilters.discount),
      limit: ADMIN_PRODUCTS_PAGE_LIMIT,
      page: debouncedFilters.page,
      search: debouncedFilters.search || undefined,
      size: debouncedFilters.size || undefined,
      sort: debouncedFilters.sort,
      status: debouncedFilters.status || undefined,
      stock: debouncedFilters.stock || undefined,
    }),
    [debouncedFilters],
  );

  const productsQuery = useAdminProducts({
    enabled: activeSection === 'products' && !isDebouncing,
    params,
  });
  const handleProductDeleted = useCallback(
    ({ productId, slug }: DeleteAdminProductResponseData) => {
      queryClient.removeQueries({
        queryKey: singleProductQueryKeys.detail(productId),
      });
      queryClient.removeQueries({
        queryKey: singleProductQueryKeys.detail(slug),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: adminReviewsQueryKeys.all,
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
        queryKey: reviewQueryKeys.userScoped(),
      });
    },
    [queryClient],
  );

  useEffect(() => {
    if (activeSection !== 'products') return;
    if (isDebouncing || productsQuery.isPlaceholderData) return;

    const pagination = productsQuery.pagination;

    if (!pagination) return;

    if (pagination.page !== page) {
      syncPage(pagination.page);
    }
  }, [
    activeSection,
    isDebouncing,
    page,
    productsQuery.isPlaceholderData,
    productsQuery.pagination,
    syncPage,
  ]);

  return {
    filters,
    onPageChange: handlePageChange,
    onProductDeleted: handleProductDeleted,
    productsQuery,
  };
};

export type AdminProductsSectionState = ReturnType<
  typeof useAdminProductsSection
>;
