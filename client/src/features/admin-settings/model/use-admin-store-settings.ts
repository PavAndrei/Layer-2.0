import { useQuery } from '@tanstack/react-query';

import { getAdminStoreSettings } from '../api';
import { adminSettingsQueryKeys } from './admin-settings-query-keys';

const ADMIN_STORE_SETTINGS_STALE_TIME_MS = 1000 * 60;

export const useAdminStoreSettings = (enabled = true) => {
  const query = useQuery({
    queryKey: adminSettingsQueryKeys.detail(),
    queryFn: ({ signal }) => getAdminStoreSettings(signal),
    enabled,
    retry: false,
    staleTime: ADMIN_STORE_SETTINGS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load admin store settings'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
    settings: response?.success ? response.data.settings : null,
  };
};
