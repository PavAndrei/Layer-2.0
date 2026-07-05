import crypto from 'crypto';
import { isObjectIdOrHexString, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import {
  AccountToken,
  type AccountTokenDocument,
} from '../models/account-tokens.model';
import type { AccountTokenPurpose } from '../types/account-token';

const ACCOUNT_TOKEN_BYTES_LENGTH = 32;

export type AccountTokenContext = {
  ip?: string;
  userAgent?: string;
};

type CreateAccountTokenParams = {
  context?: AccountTokenContext;
  expiresInMs: number;
  purpose: AccountTokenPurpose;
  revokeExisting?: boolean;
  userId: string | Types.ObjectId;
};

type ConsumeAccountTokenParams = {
  purpose: AccountTokenPurpose;
  token: string;
};

type CreateAccountTokenResult = {
  expiresAt: Date;
  token: string;
};

const getUserObjectId = (userId: string | Types.ObjectId) => {
  if (userId instanceof Types.ObjectId) return userId;

  if (!isObjectIdOrHexString(userId)) {
    throw ApiError.BadRequest('Invalid user id');
  }

  return new Types.ObjectId(userId);
};

const getAccountTokenExpiresAt = (expiresInMs: number) => {
  if (!Number.isFinite(expiresInMs) || expiresInMs <= 0) {
    throw ApiError.BadRequest('Invalid account token expiration');
  }

  return new Date(Date.now() + expiresInMs);
};

export const generateAccountToken = (): string => {
  return crypto
    .randomBytes(ACCOUNT_TOKEN_BYTES_LENGTH)
    .toString('base64url');
};

export const hashAccountToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const revokeActiveAccountTokens = async ({
  purpose,
  userId,
}: {
  purpose: AccountTokenPurpose;
  userId: string | Types.ObjectId;
}): Promise<void> => {
  const now = new Date();

  await AccountToken.updateMany(
    {
      userId: getUserObjectId(userId),
      purpose,
      consumedAt: { $exists: false },
      revokedAt: { $exists: false },
      expiresAt: { $gt: now },
    },
    {
      revokedAt: now,
    },
  );
};

export const createAccountToken = async ({
  context,
  expiresInMs,
  purpose,
  revokeExisting = true,
  userId,
}: CreateAccountTokenParams): Promise<CreateAccountTokenResult> => {
  const userObjectId = getUserObjectId(userId);
  const token = generateAccountToken();
  const expiresAt = getAccountTokenExpiresAt(expiresInMs);

  if (revokeExisting) {
    await revokeActiveAccountTokens({
      purpose,
      userId: userObjectId,
    });
  }

  await AccountToken.create({
    userId: userObjectId,
    purpose,
    tokenHash: hashAccountToken(token),
    expiresAt,
    createdByIp: context?.ip,
    userAgent: context?.userAgent,
  });

  return {
    expiresAt,
    token,
  };
};

export const consumeAccountToken = async ({
  purpose,
  token,
}: ConsumeAccountTokenParams): Promise<AccountTokenDocument> => {
  const now = new Date();
  const accountToken = await AccountToken.findOneAndUpdate(
    {
      purpose,
      tokenHash: hashAccountToken(token),
      consumedAt: { $exists: false },
      revokedAt: { $exists: false },
      expiresAt: { $gt: now },
    },
    {
      consumedAt: now,
    },
    {
      new: true,
    },
  );

  if (!accountToken) {
    throw ApiError.BadRequest('Invalid or expired account token');
  }

  return accountToken;
};
