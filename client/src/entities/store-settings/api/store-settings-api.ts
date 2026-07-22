import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { StoreSettings } from '../model';

export type StoreSettingsResponseData = {
  settings: StoreSettings;
};

export const getStoreSettings = async (
  signal?: AbortSignal,
): Promise<ApiResponse<StoreSettingsResponseData>> => {
  return apiClient.get<StoreSettingsResponseData>({
    path: '/settings',
    signal,
    errorMessage: 'Failed to load store settings',
  });
};
