import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  confirmPasswordReset as confirmPasswordResetData,
  getCurrentUser as getCurrentUserData,
  confirmEmailVerification as confirmEmailVerificationData,
  loginWithGoogle,
  loginUser,
  logoutAuthSession,
  refreshAuthSession,
  registerUser,
  requestEmailVerification as requestEmailVerificationData,
  requestPasswordReset as requestPasswordResetData,
  type AuthResult,
} from '../services/auth.service';
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE_NAME,
  setRefreshTokenCookie,
} from '../utils/refresh-token-cookie';
import type {
  AuthBootstrapResponse,
  AuthResponse,
  CurrentUserResponse,
  EmailVerificationResponse,
  LogoutResponse,
  PasswordResetResponse,
} from '../types/api';
import type {
  EmailVerificationConfirmBody,
  GoogleLoginBody,
  LoginBody,
  PasswordResetConfirmBody,
  PasswordResetRequestBody,
  RegisterBody,
} from '../validators/auth.validators';

const getRefreshTokenFromCookies = (req: Request): string | null => {
  const cookies = req.cookies as
    | Partial<Record<typeof REFRESH_TOKEN_COOKIE_NAME, unknown>>
    | undefined;
  const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  return typeof refreshToken === 'string' ? refreshToken : null;
};

const getAuthContext = (req: Request) => ({
  ip: req.ip,
  userAgent: req.get('user-agent'),
});

const sendAuthResponse = (
  res: Response<AuthResponse>,
  result: AuthResult,
  message: string,
  status = 200,
) => {
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(status).json({
    success: true,
    message,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

const sendGuestBootstrapResponse = (res: Response<AuthBootstrapResponse>) => {
  res.status(200).json({
    success: true,
    message: 'No active auth session',
    data: {
      isAuthenticated: false,
      user: null,
      accessToken: null,
    },
  });
};

export const register = async (
  req: Request,
  res: Response<AuthResponse>,
) => {
  const result = await registerUser(
    req.body as RegisterBody,
    getAuthContext(req),
  );

  sendAuthResponse(res, result, 'User registered successfully', 201);
};

export const login = async (
  req: Request,
  res: Response<AuthResponse>,
) => {
  const result = await loginUser(req.body as LoginBody, getAuthContext(req));

  sendAuthResponse(res, result, 'User logged in successfully');
};

export const googleLogin = async (
  req: Request,
  res: Response<AuthResponse>,
) => {
  const result = await loginWithGoogle(
    req.body as GoogleLoginBody,
    getAuthContext(req),
  );

  sendAuthResponse(res, result, 'User logged in with Google successfully');
};

export const refresh = async (
  req: Request,
  res: Response<AuthResponse>,
) => {
  const refreshToken = getRefreshTokenFromCookies(req);

  if (!refreshToken) {
    throw ApiError.Unauthorized('Refresh token is missing');
  }

  try {
    const result = await refreshAuthSession(
      refreshToken,
      getAuthContext(req),
    );

    sendAuthResponse(res, result, 'Token refreshed successfully');
  } catch (error) {
    clearRefreshTokenCookie(res);
    throw error;
  }
};

export const bootstrap = async (
  req: Request,
  res: Response<AuthBootstrapResponse>,
) => {
  const refreshToken = getRefreshTokenFromCookies(req);

  if (!refreshToken) {
    sendGuestBootstrapResponse(res);
    return;
  }

  try {
    const result = await refreshAuthSession(
      refreshToken,
      getAuthContext(req),
    );

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Auth session restored successfully',
      data: {
        isAuthenticated: true,
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);

    if (error instanceof ApiError) {
      sendGuestBootstrapResponse(res);
      return;
    }

    throw error;
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response<CurrentUserResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const user = await getCurrentUserData(req.user.userId);

  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully',
    data: {
      user,
    },
  });
};

export const requestEmailVerification = async (
  req: Request,
  res: Response<EmailVerificationResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const user = await requestEmailVerificationData(
    req.user.userId,
    getAuthContext(req),
  );

  res.status(200).json({
    success: true,
    message: 'Email verification requested successfully',
    data: {
      user,
    },
  });
};

export const confirmEmailVerification = async (
  req: Request,
  res: Response<EmailVerificationResponse>,
) => {
  const { token } = req.body as EmailVerificationConfirmBody;
  const user = await confirmEmailVerificationData(token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user,
    },
  });
};

export const requestPasswordReset = async (
  req: Request,
  res: Response<PasswordResetResponse>,
) => {
  await requestPasswordResetData(
    req.body as PasswordResetRequestBody,
    getAuthContext(req),
  );

  res.status(200).json({
    success: true,
    message:
      'If an account exists for this email, a password reset link has been sent',
    data: null,
  });
};

export const confirmPasswordReset = async (
  req: Request,
  res: Response<PasswordResetResponse>,
) => {
  await confirmPasswordResetData(req.body as PasswordResetConfirmBody);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
};

export const logout = async (
  req: Request,
  res: Response<LogoutResponse>,
) => {
  const refreshToken = getRefreshTokenFromCookies(req);

  if (refreshToken) {
    await logoutAuthSession(refreshToken);
  }

  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
    data: null,
  });
};
