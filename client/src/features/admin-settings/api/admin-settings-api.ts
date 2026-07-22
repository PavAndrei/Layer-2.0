import type { StoreSettings } from '../../../entities/store-settings';
import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type {
  UpdateAdminGeneralSettingsPayload,
  UpdateAdminOrderSettingsPayload,
  UpdateAdminShippingSettingsPayload,
} from '../model';

export type AdminStoreSettingsResponseData = {
  settings: StoreSettings;
};

export const getAdminStoreSettings = async (
  signal?: AbortSignal,
): Promise<ApiResponse<AdminStoreSettingsResponseData>> => {
  return apiClient.get<AdminStoreSettingsResponseData>({
    path: '/admin/settings',
    signal,
    errorMessage: 'Failed to load admin store settings',
  });
};

export const updateAdminGeneralSettings = async (
  payload: UpdateAdminGeneralSettingsPayload,
): Promise<ApiResponse<AdminStoreSettingsResponseData>> => {
  return apiClient.patch<
    AdminStoreSettingsResponseData,
    UpdateAdminGeneralSettingsPayload
  >({
    path: '/admin/settings/general',
    body: payload,
    errorMessage: 'Failed to update general settings',
  });
};

export const updateAdminShippingSettings = async (
  payload: UpdateAdminShippingSettingsPayload,
): Promise<ApiResponse<AdminStoreSettingsResponseData>> => {
  return apiClient.patch<
    AdminStoreSettingsResponseData,
    UpdateAdminShippingSettingsPayload
  >({
    path: '/admin/settings/shipping',
    body: payload,
    errorMessage: 'Failed to update shipping settings',
  });
};

export const updateAdminOrderSettings = async (
  payload: UpdateAdminOrderSettingsPayload,
): Promise<ApiResponse<AdminStoreSettingsResponseData>> => {
  return apiClient.patch<
    AdminStoreSettingsResponseData,
    UpdateAdminOrderSettingsPayload
  >({
    path: '/admin/settings/orders',
    body: payload,
    errorMessage: 'Failed to update order settings',
  });
};
