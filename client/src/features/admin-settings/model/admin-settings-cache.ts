import type { QueryClient } from '@tanstack/react-query';

import { storeSettingsQueryKeys } from '../../../entities/store-settings';
import type { ApiResponse } from '../../../shared/api';
import type { AdminStoreSettingsResponseData } from '../api';
import { adminSettingsQueryKeys } from './admin-settings-query-keys';

export const syncAdminStoreSettingsQueries = (
  queryClient: QueryClient,
  response: ApiResponse<AdminStoreSettingsResponseData>,
) => {
  if (!response.success) return;

  queryClient.setQueryData<ApiResponse<AdminStoreSettingsResponseData>>(
    adminSettingsQueryKeys.detail(),
    response,
  );
  queryClient.setQueryData<ApiResponse<AdminStoreSettingsResponseData>>(
    storeSettingsQueryKeys.detail(),
    response,
  );
};
