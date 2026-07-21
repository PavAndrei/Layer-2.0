import { z } from 'zod';

import {
  USER_AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUSES,
} from '../types/user';

export const ADMIN_USER_SORT_OPTIONS = [
  'newest',
  'oldest',
  'most-orders',
  'most-spent',
] as const;

const positiveIntegerParam = (
  name: string,
  defaultValue: number,
  maximum?: number,
) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined) return defaultValue;

      const parsedValue = Number(value);

      if (
        !Number.isInteger(parsedValue) ||
        parsedValue < 1 ||
        (maximum !== undefined && parsedValue > maximum)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return parsedValue;
    });

const optionalSearchParam = () =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim())
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || value.length <= 120,
      'Search is too long',
    );

const optionalBooleanParam = (name: string) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === '') return undefined;

      if (value !== 'true' && value !== 'false') {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid ${name}`,
        });

        return z.NEVER;
      }

      return value === 'true';
    });

export const adminUsersQuerySchema = z
  .object({
    page: positiveIntegerParam('page', 1),
    limit: positiveIntegerParam('limit', 12, 50),
    search: optionalSearchParam(),
    role: z.enum(USER_ROLES).optional(),
    provider: z.enum(USER_AUTH_PROVIDERS).optional(),
    isEmailVerified: optionalBooleanParam('email verification'),
    status: z.enum(USER_STATUSES).optional(),
    sort: z.enum(ADMIN_USER_SORT_OPTIONS).optional().default('newest'),
  })
  .strict();

export const getAdminUsersSchema = z.object({
  query: adminUsersQuerySchema,
});

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>;
export type AdminUserSortOption = (typeof ADMIN_USER_SORT_OPTIONS)[number];
