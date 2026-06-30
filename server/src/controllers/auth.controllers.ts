import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  getCurrentUser as getCurrentUserData,
  loginUser,
  logoutAuthSession,
  refreshAuthSession,
  registerUser,
  type AuthResult,
} from '../services/auth.service';
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE_NAME,
  setRefreshTokenCookie,
} from '../utils/refresh-token-cookie';
import type {
  AuthResponse,
  CurrentUserResponse,
  LogoutResponse,
} from '../types/api';
import type { LoginBody, RegisterBody } from '../validators/auth.validators';

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
