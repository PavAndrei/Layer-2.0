import { useEffect, useMemo } from 'react';

import {
  useAdminProducts,
  useAdminProductsFilters,
} from '../../../features/admin-products';
import type { AdminSection } from '../../../features/admin';

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
    productsQuery,
  };
};

export type AdminProductsSectionState = ReturnType<
  typeof useAdminProductsSection
>;
