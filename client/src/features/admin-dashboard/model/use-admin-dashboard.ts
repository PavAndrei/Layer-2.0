import { useQuery } from '@tanstack/react-query';

import {
  getAdminDashboard,
  type AdminDashboardParams,
} from '../api';
import { adminDashboardQueryKeys } from './admin-dashboard-query-keys';
import { toAdminDashboardSearchParams } from './admin-dashboard-search-params';

const ADMIN_DASHBOARD_STALE_TIME_MS = 1000 * 60;

type UseAdminDashboardOptions = {
  enabled?: boolean;
  params?: AdminDashboardParams;
};

export const useAdminDashboard = ({
  enabled = true,
  params = {},
}: UseAdminDashboardOptions = {}) => {
  const searchParams = toAdminDashboardSearchParams(params);
  const query = useQuery({
    queryKey: adminDashboardQueryKeys.detail(searchParams.toString()),
    queryFn: ({ signal }) => getAdminDashboard(params, signal),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: ADMIN_DASHBOARD_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin dashboard'
        : null;

  return {
    dashboard: response?.success ? response.data.dashboard : null,
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
};
