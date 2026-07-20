import { useEffect, useMemo } from 'react';

import {
  useAdminOrders,
  useAdminOrdersFilters,
} from '../admin-orders';
import type { AdminSection } from './model';

const ADMIN_ORDERS_PAGE_LIMIT = 12;

type UseAdminOrdersSectionParams = {
  activeSection: AdminSection;
};

export const useAdminOrdersSection = ({
  activeSection,
}: UseAdminOrdersSectionParams) => {
  const filters = useAdminOrdersFilters();
  const {
    debouncedFilters,
    handlePageChange,
    isDebouncing,
    page,
    syncPage,
  } = filters;

  const params = useMemo(
    () => ({
      limit: ADMIN_ORDERS_PAGE_LIMIT,
      page: debouncedFilters.page,
      paymentStatus: debouncedFilters.paymentStatus || undefined,
      search: debouncedFilters.search || undefined,
      status: debouncedFilters.status || undefined,
    }),
    [debouncedFilters],
  );

  const ordersQuery = useAdminOrders({
    enabled: activeSection === 'orders' && !isDebouncing,
    params,
  });

  useEffect(() => {
    if (activeSection !== 'orders') return;
    if (isDebouncing || ordersQuery.isPlaceholderData) return;

    const pagination = ordersQuery.pagination;

    if (!pagination) return;

    if (pagination.page !== page) {
      syncPage(pagination.page);
    }
  }, [
    activeSection,
    isDebouncing,
    ordersQuery.isPlaceholderData,
    ordersQuery.pagination,
    page,
    syncPage,
  ]);

  return {
    filters,
    onPageChange: handlePageChange,
    ordersQuery,
  };
};

export type AdminOrdersSectionState = ReturnType<
  typeof useAdminOrdersSection
>;
