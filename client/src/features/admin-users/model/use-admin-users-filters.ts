import { useCallback, useMemo } from 'react';

import {
  USER_AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUSES,
} from '../../../entities/user';
import { useDebouncedValue } from '../../../shared/hooks';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';
import {
  ADMIN_USER_SORT_OPTIONS,
  type AdminUserProviderFilterValue,
  type AdminUserRoleFilterValue,
  type AdminUserSortOption,
  type AdminUserStatusFilterValue,
  type AdminUserVerificationFilterValue,
} from './admin-users-filter-options';

export type AdminUsersFilters = {
  isEmailVerified: AdminUserVerificationFilterValue;
  page: number;
  provider: AdminUserProviderFilterValue;
  role: AdminUserRoleFilterValue;
  search: string;
  sort: AdminUserSortOption;
  status: AdminUserStatusFilterValue;
};

type AdminUsersUrlState = AdminUsersFilters & {
  section: string;
};

export type AdminUsersFiltersState = AdminUsersFilters & {
  debouncedFilters: AdminUsersFilters;
  handleEmailVerificationChange: (
    isEmailVerified: AdminUsersFilters['isEmailVerified'],
  ) => void;
  handlePageChange: (page: number) => void;
  handleProviderChange: (provider: AdminUsersFilters['provider']) => void;
  handleRoleChange: (role: AdminUsersFilters['role']) => void;
  handleSearchChange: (search: string) => void;
  handleSortChange: (sort: AdminUsersFilters['sort']) => void;
  handleStatusChange: (status: AdminUsersFilters['status']) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminUsersFilters: AdminUsersFilters = {
  isEmailVerified: '',
  page: 1,
  provider: '',
  role: '',
  search: '',
  sort: 'newest',
  status: '',
};

const initialAdminUsersUrlState: AdminUsersUrlState = {
  ...initialAdminUsersFilters,
  section: '',
};

const ADMIN_USERS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  search: stringParam({ name: 'search' }),
  role: customParam<AdminUsersFilters['role']>({
    parse: (searchParams) => {
      const role = searchParams.get('role');

      return USER_ROLES.find((userRole) => userRole === role) ?? '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('role');
        return;
      }

      searchParams.set('role', value);
    },
  }),
  provider: customParam<AdminUsersFilters['provider']>({
    parse: (searchParams) => {
      const provider = searchParams.get('provider');

      return (
        USER_AUTH_PROVIDERS.find(
          (authProvider) => authProvider === provider,
        ) ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('provider');
        return;
      }

      searchParams.set('provider', value);
    },
  }),
  isEmailVerified: customParam<AdminUsersFilters['isEmailVerified']>({
    parse: (searchParams) => {
      const isEmailVerified = searchParams.get('isEmailVerified');

      if (isEmailVerified === 'true') return 'verified';
      if (isEmailVerified === 'false') return 'unverified';

      return '';
    },
    serialize: (searchParams, value) => {
      if (value === '') {
        searchParams.delete('isEmailVerified');
        return;
      }

      searchParams.set(
        'isEmailVerified',
        value === 'verified' ? 'true' : 'false',
      );
    },
  }),
  status: customParam<AdminUsersFilters['status']>({
    parse: (searchParams) => {
      const status = searchParams.get('status');

      return USER_STATUSES.find((userStatus) => userStatus === status) ?? '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('status');
        return;
      }

      searchParams.set('status', value);
    },
  }),
  sort: customParam<AdminUsersFilters['sort']>({
    parse: (searchParams) => {
      const sort = searchParams.get('sort');

      return (
        ADMIN_USER_SORT_OPTIONS.find((sortOption) => sortOption === sort) ??
        initialAdminUsersFilters.sort
      );
    },
    serialize: (searchParams, value) => {
      if (value === initialAdminUsersFilters.sort) {
        searchParams.delete('sort');
        return;
      }

      searchParams.set('sort', value);
    },
  }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminUsersFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  isEmailVerified,
  page,
  provider,
  role,
  search,
  sort,
  status,
}: AdminUsersUrlState): AdminUsersFilters => ({
  isEmailVerified,
  page,
  provider,
  role,
  search,
  sort,
  status,
});

export const useAdminUsersFilters = (): AdminUsersFiltersState => {
  const [urlState, setUrlState] = useUrlState<AdminUsersUrlState>(
    ADMIN_USERS_FILTERS_URL_SCHEMA,
    { replace: true },
  );

  const filters = useMemo(() => toFilters(urlState), [urlState]);

  const setFilters = useCallback<UrlStateSetter<AdminUsersFilters>>(
    (value, options) => {
      setUrlState((prev) => {
        const previousFilters = toFilters(prev);
        const nextFilters =
          typeof value === 'function'
            ? (value as (state: AdminUsersFilters) => AdminUsersFilters)(
              previousFilters,
            )
            : value;

        return {
          ...prev,
          ...nextFilters,
        };
      }, options);
    },
    [setUrlState],
  );

  const debouncedSearch = useDebouncedValue(filters.search, 400);

  const debouncedFilters = useMemo<AdminUsersFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters],
  );

  const isDebouncing = filters.search !== debouncedSearch;

  const resetFilters = useCallback(() => {
    setUrlState(
      (prev) => ({
        ...initialAdminUsersUrlState,
        section: prev.section,
      }),
      { replace: true },
    );
  }, [setUrlState]);

  const updateFilter = useCallback(
    <Key extends keyof AdminUsersFilters>(
      field: Key,
      value: AdminUsersFilters[Key],
    ) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [field]: value,
      }));
    },
    [setFilters],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters(
        (prev) => ({
          ...prev,
          page,
        }),
        { replace: false },
      );
    },
    [setFilters],
  );

  const syncPage = useCallback(
    (page: number) => {
      setFilters((prev) => ({
        ...prev,
        page,
      }));
    },
    [setFilters],
  );

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      handleEmailVerificationChange: (
        isEmailVerified: AdminUsersFilters['isEmailVerified'],
      ) => updateFilter('isEmailVerified', isEmailVerified),
      handlePageChange,
      handleProviderChange: (provider: AdminUsersFilters['provider']) =>
        updateFilter('provider', provider),
      handleRoleChange: (role: AdminUsersFilters['role']) =>
        updateFilter('role', role),
      handleSearchChange: (search: string) =>
        updateFilter('search', search),
      handleSortChange: (sort: AdminUsersFilters['sort']) =>
        updateFilter('sort', sort),
      handleStatusChange: (status: AdminUsersFilters['status']) =>
        updateFilter('status', status),
      isDebouncing,
      resetFilters,
      syncPage,
    }),
    [
      debouncedFilters,
      filters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      syncPage,
      updateFilter,
    ],
  );
};
