import {
  USER_AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUSES,
  type UserAuthProvider,
  type UserRole,
  type UserStatus,
} from '../../../entities/user';
import type { SelectFilterOption } from '../../../shared/ui';
import type { AdminUserSortOption } from '../api';

export type { AdminUserSortOption } from '../api';

export const ADMIN_USER_SORT_OPTIONS = [
  'newest',
  'oldest',
  'most-orders',
  'most-spent',
] as const satisfies readonly AdminUserSortOption[];

export type AdminUserRoleFilterValue = UserRole | '';
export type AdminUserProviderFilterValue = UserAuthProvider | '';
export type AdminUserVerificationFilterValue = 'verified' | 'unverified' | '';
export type AdminUserStatusFilterValue = UserStatus | '';

export type AdminUserRoleFilterOption =
  SelectFilterOption<AdminUserRoleFilterValue>;
export type AdminUserProviderFilterOption =
  SelectFilterOption<AdminUserProviderFilterValue>;
export type AdminUserVerificationFilterOption =
  SelectFilterOption<AdminUserVerificationFilterValue>;
export type AdminUserStatusFilterOption =
  SelectFilterOption<AdminUserStatusFilterValue>;
export type AdminUserSortFilterOption =
  SelectFilterOption<AdminUserSortOption>;

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
};

const providerLabels: Record<UserAuthProvider, string> = {
  google: 'Google',
  password: 'Email and password',
};

const statusLabels: Record<UserStatus, string> = {
  active: 'Active',
  blocked: 'Blocked',
};

export const ADMIN_USER_ROLE_FILTER_OPTIONS: readonly AdminUserRoleFilterOption[] = [
  { label: 'All roles', value: '' },
  ...USER_ROLES.map((role) => ({
    label: roleLabels[role],
    value: role,
  })),
];

export const ADMIN_USER_PROVIDER_FILTER_OPTIONS: readonly AdminUserProviderFilterOption[] = [
  { label: 'All providers', value: '' },
  ...USER_AUTH_PROVIDERS.map((provider) => ({
    label: providerLabels[provider],
    value: provider,
  })),
];

export const ADMIN_USER_VERIFICATION_FILTER_OPTIONS: readonly AdminUserVerificationFilterOption[] = [
  { label: 'All verification states', value: '' },
  { label: 'Verified', value: 'verified' },
  { label: 'Not verified', value: 'unverified' },
];

export const ADMIN_USER_STATUS_FILTER_OPTIONS: readonly AdminUserStatusFilterOption[] = [
  { label: 'All statuses', value: '' },
  ...USER_STATUSES.map((status) => ({
    label: statusLabels[status],
    value: status,
  })),
];

export const ADMIN_USER_SORT_FILTER_OPTIONS: readonly AdminUserSortFilterOption[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Most orders', value: 'most-orders' },
  { label: 'Most spent', value: 'most-spent' },
];
