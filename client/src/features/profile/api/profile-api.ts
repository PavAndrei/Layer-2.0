import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { User } from '../../../entities/user';

type ProfileResponseData = {
  user: User;
};

export const getProfile = async (): Promise<
  ApiResponse<ProfileResponseData>
> => {
  return apiClient.get<ProfileResponseData>({
    path: '/auth/me',
    errorMessage: 'Failed to load profile',
  });
};
