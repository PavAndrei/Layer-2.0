import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type {
  AuthBootstrapResponseData,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  User,
} from '../model';

type CurrentUserResponseData = {
  user: User;
};

export const register = async (
  payload: RegisterPayload,
): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData, RegisterPayload>({
    path: '/auth/register',
    body: payload,
    errorMessage: 'Failed to register',
  });
};

export const login = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData, LoginPayload>({
    path: '/auth/login',
    body: payload,
    errorMessage: 'Failed to login',
  });
};

export const refreshAuth = async (): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData>({
    path: '/auth/refresh',
    errorMessage: 'Failed to refresh session',
  });
};

export const bootstrapAuth = async (): Promise<
  ApiResponse<AuthBootstrapResponseData>
> => {
  return apiClient.post<AuthBootstrapResponseData>({
    path: '/auth/bootstrap',
    errorMessage: 'Failed to restore auth session',
  });
};

export const logout = async (): Promise<ApiResponse<null>> => {
  return apiClient.post<null>({
    path: '/auth/logout',
    errorMessage: 'Failed to logout',
  });
};

export const getCurrentUser = async (): Promise<
  ApiResponse<CurrentUserResponseData>
> => {
  return apiClient.get<CurrentUserResponseData>({
    path: '/auth/me',
    errorMessage: 'Failed to load current user',
  });
};
