import type { SignOptions } from 'jsonwebtoken';

import getEnv from '../utils/get-env';
import {
  normalizeJwtExpiresIn,
  parseJwtExpiresInToMs,
} from '../utils/parse-duration-ms';

const getJwtExpiresIn = (
  key: string,
  defaultValue: string,
): NonNullable<SignOptions['expiresIn']> =>
  normalizeJwtExpiresIn(getEnv(key, defaultValue));

const getDurationInMs = (key: string, defaultValue: string): number =>
  parseJwtExpiresInToMs(normalizeJwtExpiresIn(getEnv(key, defaultValue)));

export const ACCESS_TOKEN_EXPIRES_IN = getJwtExpiresIn(
  'ACCESS_TOKEN_EXPIRES_IN',
  '15m',
);
export const ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET');
export const CLIENT_ORIGIN = getEnv('CLIENT_ORIGIN', 'http://localhost:5173');
export const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS = getDurationInMs(
  'EMAIL_VERIFICATION_TOKEN_EXPIRES_IN',
  '1d',
);
export const MONGO_URI = getEnv('MONGO_URI');
export const PASSWORD_RESET_TOKEN_EXPIRES_IN_MS = getDurationInMs(
  'PASSWORD_RESET_TOKEN_EXPIRES_IN',
  '1h',
);
export const PORT = getEnv('PORT', '5000');
export const REFRESH_TOKEN_EXPIRES_IN = getJwtExpiresIn(
  'REFRESH_TOKEN_EXPIRES_IN',
  '30d',
);
export const REFRESH_TOKEN_EXPIRES_IN_MS = parseJwtExpiresInToMs(
  REFRESH_TOKEN_EXPIRES_IN,
);
export const REFRESH_TOKEN_SECRET = getEnv('REFRESH_TOKEN_SECRET');
