import type { SignOptions } from 'jsonwebtoken';

const DURATION_UNITS_IN_MS = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
} as const;

type JwtExpiresIn = NonNullable<SignOptions['expiresIn']>;

export const normalizeJwtExpiresIn = (value: string): JwtExpiresIn => {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return trimmedValue as JwtExpiresIn;
};

export const parseJwtExpiresInToMs = (expiresIn: JwtExpiresIn): number => {
  if (typeof expiresIn === 'number') {
    return expiresIn * 1000;
  }

  const match = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/.exec(expiresIn.trim());

  if (!match) {
    throw new Error(`Unsupported JWT expiration format: ${expiresIn}`);
  }

  const [, rawAmount, unit] = match;
  const amount = Number(rawAmount);
  const multiplier =
    DURATION_UNITS_IN_MS[unit as keyof typeof DURATION_UNITS_IN_MS];
  const milliseconds = amount * multiplier;

  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    throw new Error(`Invalid JWT expiration value: ${expiresIn}`);
  }

  return milliseconds;
};
