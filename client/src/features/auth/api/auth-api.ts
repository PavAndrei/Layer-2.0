import { apiClient } from '../../../shared/api';
import type { ApiResponse } from '../../../shared/api';
import type {
  AuthBootstrapResponseData,
  AuthResponseData,
  AuthUserResponseData,
  EmailVerificationConfirmPayload,
  GoogleLoginPayload,
  LoginPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
} from '../model';

type CurrentUserResponseData = AuthUserResponseData;

export const register = async (
  payload: RegisterPayload,
): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData, RegisterPayload>({
    path: '/auth/register',
    body: payload,
    errorMessage: 'Failed to register',
    skipAuthRefresh: true,
  });
};

export const login = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData, LoginPayload>({
    path: '/auth/login',
    body: payload,
    errorMessage: 'Failed to login',
    skipAuthRefresh: true,
  });
};

export const loginWithGoogle = async (
  payload: GoogleLoginPayload,
): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData, GoogleLoginPayload>({
    path: '/auth/google',
    body: payload,
    errorMessage: 'Failed to login with Google',
    skipAuthRefresh: true,
  });
};

export const refreshAuth = async (): Promise<ApiResponse<AuthResponseData>> => {
  return apiClient.post<AuthResponseData>({
    path: '/auth/refresh',
    errorMessage: 'Failed to refresh session',
    skipAuthRefresh: true,
  });
};

export const bootstrapAuth = async (): Promise<
  ApiResponse<AuthBootstrapResponseData>
> => {
  return apiClient.post<AuthBootstrapResponseData>({
    path: '/auth/bootstrap',
    errorMessage: 'Failed to restore auth session',
    skipAuthRefresh: true,
  });
};

export const logout = async (): Promise<ApiResponse<null>> => {
  return apiClient.post<null>({
    path: '/auth/logout',
    errorMessage: 'Failed to logout',
    skipAuthRefresh: true,
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

export const requestEmailVerification = async (): Promise<
  ApiResponse<AuthUserResponseData>
> => {
  return apiClient.post<AuthUserResponseData>({
    path: '/auth/email-verification/request',
    errorMessage: 'Failed to request email verification',
  });
};

export const confirmEmailVerification = async (
  payload: EmailVerificationConfirmPayload,
): Promise<ApiResponse<AuthUserResponseData>> => {
  return apiClient.post<
    AuthUserResponseData,
    EmailVerificationConfirmPayload
  >({
    path: '/auth/email-verification/confirm',
    body: payload,
    errorMessage: 'Failed to confirm email verification',
    skipAuthRefresh: true,
  });
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
): Promise<ApiResponse<null>> => {
  return apiClient.post<null, PasswordResetRequestPayload>({
    path: '/auth/password-reset/request',
    body: payload,
    errorMessage: 'Failed to request password reset',
    skipAuthRefresh: true,
  });
};

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload,
): Promise<ApiResponse<null>> => {
  return apiClient.post<null, PasswordResetConfirmPayload>({
    path: '/auth/password-reset/confirm',
    body: payload,
    errorMessage: 'Failed to reset password',
    skipAuthRefresh: true,
  });
};
