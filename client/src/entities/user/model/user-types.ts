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
  createdAt: string;
  ordersCount: number;
  status: UserStatus;
  totalSpent: number;
  updatedAt: string;
};
