import type { AdminUserRecentOrder } from '../../order';
import type { AdminUserRecentReview } from '../../review';

export const USER_AUTH_PROVIDERS = ['password', 'google'] as const;
export const USER_ROLES = ['customer', 'admin'] as const;
export const USER_STATUSES = ['active', 'blocked'] as const;

export type UserAuthProvider = (typeof USER_AUTH_PROVIDERS)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export type User = {
  _id: string;
  authProviders: UserAuthProvider[];
  avatarUrl?: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBlocked: boolean;
};

export type AdminUserListItem = User & {
  adminNote?: string;
  createdAt: string;
  ordersCount: number;
  status: UserStatus;
  totalSpent: number;
  updatedAt: string;
};

export type AdminUserStats = {
  activeSessionsCount: number;
  lastOrderAt: string | null;
  reviewsCount: number;
  totalSpent: number;
};

export type AdminUser = User & {
  adminNote?: string;
  createdAt: string;
  lastLoginAt: string | null;
  recentOrders: AdminUserRecentOrder[];
  recentReviews: AdminUserRecentReview[];
  stats: AdminUserStats;
  status: UserStatus;
  updatedAt: string;
};
