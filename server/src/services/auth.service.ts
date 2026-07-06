import { isObjectIdOrHexString, Types } from 'mongoose';

import {
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MS,
  REFRESH_TOKEN_EXPIRES_IN_MS,
} from '../constants/env';
import { ApiError } from '../exceptions/api-error';
import { AuthSession } from '../models/auth-sessions.model';
import { User, type UserDocument } from '../models/users.model';
import type { UserDto } from '../types/api';
import {
  consumeAccountToken,
  createAccountToken,
  revokeActiveAccountTokens,
} from './account-tokens.service';
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from './email.service';
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/auth-tokens';
import { hashPassword, verifyPassword } from '../utils/password';
import { userToDto } from '../utils/user-to-dto';
import type {
  LoginBody,
  PasswordResetConfirmBody,
  PasswordResetRequestBody,
  RegisterBody,
} from '../validators/auth.validators';

export type AuthContext = {
  ip?: string;
  userAgent?: string;
};

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};

const EMAIL_VERIFICATION_REQUEST_COOLDOWN_MS = 60 * 1000;
const PASSWORD_RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

const getRefreshTokenExpiresAt = () =>
  new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS);

const sendEmailVerificationToken = async (
  user: UserDocument,
  context: AuthContext,
  options: {
    cooldownMs?: number;
  } = {},
) => {
  const { token } = await createAccountToken({
    cooldownMs: options.cooldownMs,
    context,
    expiresInMs: EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS,
    purpose: 'email-verification',
    userId: user._id,
  });

  await sendEmailVerificationEmail({
    email: user.email,
    name: user.name,
    token,
  });
};

const sendPasswordResetToken = async (
  user: UserDocument,
  context: AuthContext,
  options: {
    cooldownMs?: number;
  } = {},
) => {
  const { token } = await createAccountToken({
    cooldownMs: options.cooldownMs,
    context,
    expiresInMs: PASSWORD_RESET_TOKEN_EXPIRES_IN_MS,
    purpose: 'password-reset',
    userId: user._id,
  });

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    token,
  });
};

const sendInitialEmailVerificationToken = async (
  user: UserDocument,
  context: AuthContext,
) => {
  try {
    await sendEmailVerificationToken(user, context);
  } catch (error) {
    console.error('Failed to send registration verification email', {
      error,
      userId: user._id.toString(),
    });
  }
};

const revokeAuthSessionsForUser = async (userId: Types.ObjectId) => {
  await AuthSession.updateMany(
    {
      userId,
      revokedAt: { $exists: false },
    },
    {
      revokedAt: new Date(),
    },
  );
};

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

  await sendInitialEmailVerificationToken(user, context);

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

  if (!user.passwordHash) {
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

export const requestEmailVerification = async (
  userId: string,
  context: AuthContext,
): Promise<UserDto> => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.Unauthorized('User not found');
  }

  if (!user.isEmailVerified) {
    await sendEmailVerificationToken(user, context, {
      cooldownMs: EMAIL_VERIFICATION_REQUEST_COOLDOWN_MS,
    });
  }

  return userToDto(user);
};

export const confirmEmailVerification = async (
  token: string,
): Promise<UserDto> => {
  const accountToken = await consumeAccountToken({
    purpose: 'email-verification',
    token,
  });
  const user = await User.findByIdAndUpdate(
    accountToken.userId,
    {
      isEmailVerified: true,
    },
    {
      new: true,
    },
  );

  if (!user) {
    throw ApiError.BadRequest('Invalid or expired account token');
  }

  await revokeActiveAccountTokens({
    purpose: 'email-verification',
    userId: user._id,
  });

  return userToDto(user);
};

export const requestPasswordReset = async (
  body: PasswordResetRequestBody,
  context: AuthContext,
): Promise<void> => {
  const user = await User.findOne({ email: body.email });

  if (!user) return;

  try {
    await sendPasswordResetToken(user, context, {
      cooldownMs: PASSWORD_RESET_REQUEST_COOLDOWN_MS,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return;
    }

    throw error;
  }
};

export const confirmPasswordReset = async ({
  password,
  token,
}: PasswordResetConfirmBody): Promise<void> => {
  const accountToken = await consumeAccountToken({
    purpose: 'password-reset',
    token,
  });
  const passwordHash = await hashPassword(password);
  const user = await User.findByIdAndUpdate(
    accountToken.userId,
    {
      passwordHash,
    },
    {
      new: true,
    },
  );

  if (!user) {
    throw ApiError.BadRequest('Invalid or expired account token');
  }

  await Promise.all([
    revokeActiveAccountTokens({
      purpose: 'password-reset',
      userId: user._id,
    }),
    revokeAuthSessionsForUser(user._id),
  ]);
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
