import type { SignOptions } from 'jsonwebtoken';

import getEnv from '../utils/get-env';

export const ACCESS_TOKEN_EXPIRES_IN = getEnv(
  'ACCESS_TOKEN_EXPIRES_IN',
  '15m',
) as SignOptions['expiresIn'];
export const ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET');
export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '5000');
export const REFRESH_TOKEN_EXPIRES_IN = getEnv(
  'REFRESH_TOKEN_EXPIRES_IN',
  '30d',
) as SignOptions['expiresIn'];
export const REFRESH_TOKEN_SECRET = getEnv('REFRESH_TOKEN_SECRET');
