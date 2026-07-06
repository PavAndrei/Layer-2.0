import type { Request, RequestHandler } from 'express';

import { ApiError } from '../exceptions/api-error';

type RateLimitOptions = {
  keyPrefix: string;
  maxRequests: number;
  message?: string;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientKey = (req: Request, keyPrefix: string) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const routeKey = `${req.method}:${req.baseUrl}${req.path}`;

  return `${keyPrefix}:${routeKey}:${ip}`;
};

const pruneExpiredEntries = (now: number) => {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

export const rateLimit = ({
  keyPrefix,
  maxRequests,
  message = 'Too many requests. Please try again later.',
  windowMs,
}: RateLimitOptions): RequestHandler => {
  if (!Number.isFinite(windowMs) || windowMs <= 0) {
    throw new Error('Rate limit windowMs must be a positive number');
  }

  if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
    throw new Error('Rate limit maxRequests must be a positive integer');
  }

  return (req, res, next) => {
    const now = Date.now();

    pruneExpiredEntries(now);

    const key = getClientKey(req, keyPrefix);
    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt <= now) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        Math.ceil((entry.resetAt - now) / 1000),
        1,
      );

      res.setHeader('Retry-After', String(retryAfterSeconds));
      next(ApiError.TooManyRequests(message));
      return;
    }

    entry.count += 1;
    next();
  };
};
