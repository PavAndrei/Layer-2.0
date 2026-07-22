import { useQuery } from '@tanstack/react-query';

import { getStoreSettings } from '../api';
import { storeSettingsQueryKeys } from './store-settings-query-keys';

const STORE_SETTINGS_STALE_TIME_MS = 1000 * 60 * 5;

export const useStoreSettings = () => {
  const query = useQuery({
    queryKey: storeSettingsQueryKeys.detail(),
    queryFn: ({ signal }) => getStoreSettings(signal),
    retry: false,
    staleTime: STORE_SETTINGS_STALE_TIME_MS,
  });

  const response = query.data;
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load store settings'
        : null;

  return {
    error: responseError ?? queryError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    settings: response?.success ? response.data.settings : null,
  };
};
