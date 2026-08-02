import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type { User } from '../../../entities/user';

type ProfileResponseData = {
  user: User;
};

export type UpdateProfileAvatarPayload = {
  fileId: string;
  filePath: string;
  url: string;
};

export type UpdateProfilePayload = {
  avatar?: UpdateProfileAvatarPayload | null;
  name?: string;
};

export type UpdateProfileResponseData = ProfileResponseData;

export const getProfile = async (): Promise<
  ApiResponse<ProfileResponseData>
> => {
  return apiClient.get<ProfileResponseData>({
    path: '/auth/me',
    errorMessage: 'Failed to load profile',
  });
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ApiResponse<UpdateProfileResponseData>> => {
  return apiClient.patch<UpdateProfileResponseData, UpdateProfilePayload>({
    path: '/auth/me',
    body: payload,
    errorMessage: 'Failed to update profile',
  });
};
