import { isObjectIdOrHexString, Types } from 'mongoose';

import { REFRESH_TOKEN_EXPIRES_IN_MS } from '../constants/env';
import { ApiError } from '../exceptions/api-error';
import { AuthSession } from '../models/auth-sessions.model';
import { User, type UserDocument } from '../models/users.model';
import type { UserDto } from '../types/api';
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/auth-tokens';
import { hashPassword, verifyPassword } from '../utils/password';
import { userToDto } from '../utils/user-to-dto';
import type { LoginBody, RegisterBody } from '../validators/auth.validators';

export type AuthContext = {
  ip?: string;
  userAgent?: string;
};

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};

const getRefreshTokenExpiresAt = () =>
  new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS);

const createAuthSession = async (
  user: UserDocument,
  context: AuthContext,
) => {
  const sessionId = new Types.ObjectId();
  const userId = user._id.toString();
  const accessToken = signAccessToken({
    userId,
    role: user.role,
  });
  const refreshToken = signRefreshToken({
    sessionId: sessionId.toString(),
    userId,
  });

  await AuthSession.create({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiresAt(),
    createdByIp: context.ip,
    userAgent: context.userAgent,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const createAuthResult = async (
  user: UserDocument,
  context: AuthContext,
): Promise<AuthResult> => {
  const { accessToken, refreshToken } = await createAuthSession(user, context);

  return {
    accessToken,
    refreshToken,
    user: userToDto(user),
  };
};

export const registerUser = async (
  body: RegisterBody,
  context: AuthContext,
): Promise<AuthResult> => {
  const { email, password, name } = body;
  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw ApiError.Conflict('User with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    passwordHash,
    name,
    role: 'customer',
  });

  return createAuthResult(user, context);
};

export const loginUser = async (
  body: LoginBody,
  context: AuthContext,
): Promise<AuthResult> => {
  const { email, password } = body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw ApiError.Unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.Unauthorized('Invalid email or password');
  }

  return createAuthResult(user, context);
};

export const refreshAuthSession = async (
  refreshToken: string,
  context: AuthContext,
): Promise<AuthResult> => {
  let payload: ReturnType<typeof verifyRefreshToken>;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.Unauthorized('Invalid refresh token');
  }

  if (
    !isObjectIdOrHexString(payload.sessionId) ||
    !isObjectIdOrHexString(payload.userId)
  ) {
    throw ApiError.Unauthorized('Invalid refresh token');
  }

  const now = new Date();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const session = await AuthSession.findOneAndUpdate(
    {
      _id: payload.sessionId,
      userId: payload.userId,
      refreshTokenHash,
      revokedAt: { $exists: false },
      expiresAt: { $gt: now },
    },
    {
      revokedAt: now,
    },
    {
      new: true,
    },
  );

  if (!session) {
    await AuthSession.findOneAndUpdate(
      {
        _id: payload.sessionId,
        userId: payload.userId,
        revokedAt: { $exists: false },
      },
      {
        revokedAt: now,
      },
    );

    throw ApiError.Unauthorized('Invalid refresh session');
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw ApiError.Unauthorized('User not found');
  }

  return createAuthResult(user, context);
};

export const getCurrentUser = async (userId: string): Promise<UserDto> => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.Unauthorized('User not found');
  }

  return userToDto(user);
};

export const logoutAuthSession = async (
  refreshToken: string,
): Promise<void> => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    if (
      !isObjectIdOrHexString(payload.sessionId) ||
      !isObjectIdOrHexString(payload.userId)
    ) {
      return;
    }

    await AuthSession.findOneAndUpdate(
      {
        _id: payload.sessionId,
        userId: payload.userId,
        refreshTokenHash: hashRefreshToken(refreshToken),
        revokedAt: { $exists: false },
      },
      {
        revokedAt: new Date(),
      },
    );
  } catch {
    // Logout should be idempotent even when the token is already invalid.
  }
};
