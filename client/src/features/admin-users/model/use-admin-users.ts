import { useQuery } from '@tanstack/react-query';

import {
  getAdminUsers,
  type AdminUsersParams,
} from '../api';
import { adminUsersQueryKeys } from './admin-users-query-keys';
import { toAdminUsersSearchParams } from './admin-users-search-params';

const ADMIN_USERS_STALE_TIME_MS = 1000 * 60;

type UseAdminUsersOptions = {
  enabled?: boolean;
  params?: AdminUsersParams;
};

export const useAdminUsers = ({
  enabled = true,
  params = {},
}: UseAdminUsersOptions = {}) => {
  const searchParams = toAdminUsersSearchParams(params);
  const query = useQuery({
    queryKey: adminUsersQueryKeys.list(searchParams.toString()),
    queryFn: ({ signal }) => getAdminUsers(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_USERS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin users'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    pagination: response?.success ? response.data.pagination : null,
    refetch: query.refetch,
    users: response?.success ? response.data.users : [],
  };
};
