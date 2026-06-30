import type { Response } from 'express';

import { REFRESH_TOKEN_EXPIRES_IN_MS } from '../constants/env';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_COOKIE_PATH = '/auth';
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = REFRESH_TOKEN_EXPIRES_IN_MS;

const isProduction = process.env.NODE_ENV === 'production';

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    path: REFRESH_TOKEN_COOKIE_PATH,
    sameSite: 'lax',
    secure: isProduction,
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    path: REFRESH_TOKEN_COOKIE_PATH,
    sameSite: 'lax',
    secure: isProduction,
  });
};

export { REFRESH_TOKEN_COOKIE_MAX_AGE_MS, REFRESH_TOKEN_COOKIE_NAME };
