import { useEffect, useMemo } from 'react';

import {
  useAdminUsers,
  useAdminUsersFilters,
} from '../admin-users';
import type { AdminSection } from './model';

const ADMIN_USERS_PAGE_LIMIT = 12;

type UseAdminUsersSectionParams = {
  activeSection: AdminSection;
};

const toEmailVerificationParam = (
  value: ReturnType<typeof useAdminUsersFilters>['isEmailVerified'],
) => {
  if (value === 'verified') return true;
  if (value === 'unverified') return false;

  return undefined;
};

export const useAdminUsersSection = ({
  activeSection,
}: UseAdminUsersSectionParams) => {
  const filters = useAdminUsersFilters();
  const {
    debouncedFilters,
    handlePageChange,
    isDebouncing,
    page,
    syncPage,
  } = filters;

  const params = useMemo(
    () => ({
      isEmailVerified: toEmailVerificationParam(
        debouncedFilters.isEmailVerified,
      ),
      limit: ADMIN_USERS_PAGE_LIMIT,
      page: debouncedFilters.page,
      provider: debouncedFilters.provider || undefined,
      role: debouncedFilters.role || undefined,
      search: debouncedFilters.search || undefined,
      sort: debouncedFilters.sort,
      status: debouncedFilters.status || undefined,
    }),
    [debouncedFilters],
  );

  const usersQuery = useAdminUsers({
    enabled: activeSection === 'users' && !isDebouncing,
    params,
  });

  useEffect(() => {
    if (activeSection !== 'users') return;
    if (isDebouncing || usersQuery.isPlaceholderData) return;

    const pagination = usersQuery.pagination;

    if (!pagination) return;

    if (pagination.page !== page) {
      syncPage(pagination.page);
    }
  }, [
    activeSection,
    isDebouncing,
    page,
    syncPage,
    usersQuery.isPlaceholderData,
    usersQuery.pagination,
  ]);

  return {
    filters,
    onPageChange: handlePageChange,
    usersQuery,
  };
};

export type AdminUsersSectionState = ReturnType<typeof useAdminUsersSection>;
