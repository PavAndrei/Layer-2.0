import type { User } from '../../../entities/user';
import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';

export type AdminMeResponseData = {
  user: User;
};

export const getAdminMe = async (): Promise<
  ApiResponse<AdminMeResponseData>
> => {
  return apiClient.get<AdminMeResponseData>({
    path: '/admin/me',
    errorMessage: 'Failed to load admin access',
  });
};
