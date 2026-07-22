import type { Types } from 'mongoose';

import type { AdminUserListItemDto } from '../types/api';
import type { UserAuthProvider } from '../types/user';

export type AdminUserListItemSource = {
  _id: Types.ObjectId;
  adminNote?: string;
  authProviders?: UserAuthProvider[];
  avatarUrl?: string;
  createdAt: Date;
  email: string;
  isBlocked?: boolean;
  isEmailVerified: boolean;
  name: string;
  ordersCount?: number;
  role: AdminUserListItemDto['role'];
  totalSpent?: number;
  updatedAt: Date;
};

export const getAdminUserAuthProviders = (
  providers: UserAuthProvider[] | undefined,
): UserAuthProvider[] => {
  if (providers?.length) {
    return providers;
  }

  return ['password'];
};

export const getAdminUserStatus = (isBlocked: boolean) =>
  isBlocked ? 'blocked' : 'active';

export const adminUserToListItemDto = (
  user: AdminUserListItemSource,
): AdminUserListItemDto => {
  const isBlocked = Boolean(user.isBlocked);

  return {
    _id: user._id.toString(),
    adminNote: user.adminNote ?? undefined,
    authProviders: getAdminUserAuthProviders(user.authProviders),
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    isBlocked,
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    ordersCount: user.ordersCount ?? 0,
    role: user.role,
    status: getAdminUserStatus(isBlocked),
    totalSpent: Number((user.totalSpent ?? 0).toFixed(2)),
    updatedAt: user.updatedAt.toISOString(),
  };
};
