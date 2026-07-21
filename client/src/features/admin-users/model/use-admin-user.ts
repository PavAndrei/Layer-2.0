import { useQuery } from '@tanstack/react-query';

import { getAdminUser } from '../api';
import { adminUsersQueryKeys } from './admin-users-query-keys';

const ADMIN_USER_STALE_TIME_MS = 1000 * 60;

type UseAdminUserOptions = {
  enabled?: boolean;
  userId?: string;
};

export const useAdminUser = ({
  enabled = true,
  userId,
}: UseAdminUserOptions) => {
  const query = useQuery({
    queryKey: adminUsersQueryKeys.detail(userId ?? ''),
    queryFn: ({ signal }) => getAdminUser(userId ?? '', signal),
    enabled: enabled && Boolean(userId),
    retry: false,
    staleTime: ADMIN_USER_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin user'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
    user: response?.success ? response.data.user : null,
  };
};
