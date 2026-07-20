import type { RequestHandler } from 'express';
import { isObjectIdOrHexString } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { User } from '../models/users.model';
import { USER_ROLES, type UserRole } from '../types/user';
import { verifyAccessToken } from '../utils/auth-tokens';

const AUTH_HEADER_PREFIX = 'Bearer ';

const getAccessTokenFromHeader = (authorization?: string): string | null => {
  if (!authorization?.startsWith(AUTH_HEADER_PREFIX)) return null;

  const token = authorization.slice(AUTH_HEADER_PREFIX.length).trim();

  return token || null;
};

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const accessToken = getAccessTokenFromHeader(req.get('authorization'));

  if (!accessToken) {
    return next(ApiError.Unauthorized('Access token is missing'));
  }

  try {
    const payload = verifyAccessToken(accessToken);
    const isKnownRole = USER_ROLES.some((role) => role === payload.role);

    if (!isObjectIdOrHexString(payload.userId) || !isKnownRole) {
      return next(ApiError.Unauthorized('Invalid access token'));
    }

    req.user = payload;

    next();
  } catch {
    next(ApiError.Unauthorized('Invalid access token'));
  }
};

export const requireUser: RequestHandler = async (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.Unauthorized());
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    return next(ApiError.Unauthorized('User not found'));
  }

  req.currentUser = user;

  next();
};

export const requireRole =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.currentUser) {
      return next(ApiError.Unauthorized());
    }

    const hasAllowedRole = allowedRoles.some(
      (role) => role === req.currentUser?.role,
    );

    if (!hasAllowedRole) {
      return next(ApiError.Forbidden());
    }

    next();
  };

export const requireAdmin = requireRole('admin');
