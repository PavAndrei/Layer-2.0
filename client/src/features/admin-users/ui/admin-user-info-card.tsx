import type { ReactNode } from 'react';

import type { AdminUser } from '../../../entities/user';
import { formatDisplayDate } from '../../../shared/lib';
import {
  AdminUserProviderBadges,
  AdminUserRoleBadge,
  AdminUserStatusBadge,
  AdminUserVerificationBadge,
} from './admin-user-badges';

type AdminUserInfoCardProps = {
  user: AdminUser;
};

type AdminUserInfoFieldProps = {
  children: ReactNode;
  label: string;
};

const getUserInitials = (user: AdminUser) => {
  const source = user.name || user.email;
  const [first = '', second = ''] = source.trim().split(/\s+/);

  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || 'U';
};

const AdminUserInfoField = ({ children, label }: AdminUserInfoFieldProps) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span className="block-small text-typography-secondary">{label}</span>
    <div className="block-medium text-typography-heading">{children}</div>
  </div>
);

export const AdminUserInfoCard = ({ user }: AdminUserInfoCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Info</h2>

    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-border-soft bg-background-secondary block-title text-typography-heading">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          getUserInitials(user)
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="truncate block-title text-typography-heading">
          {user.name}
        </h2>
        <p className="truncate block-small text-typography-secondary">
          {user.email}
        </p>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <AdminUserInfoField label="Last login">
        {user.lastLoginAt ? formatDisplayDate(user.lastLoginAt) : 'Never'}
      </AdminUserInfoField>

      <AdminUserInfoField label="Email">
        <span className="block truncate">{user.email}</span>
      </AdminUserInfoField>

      <AdminUserInfoField label="Role">
        <AdminUserRoleBadge role={user.role} />
      </AdminUserInfoField>

      <AdminUserInfoField label="Status">
        <AdminUserStatusBadge status={user.status} />
      </AdminUserInfoField>

      <AdminUserInfoField label="Provider">
        <AdminUserProviderBadges providers={user.authProviders} />
      </AdminUserInfoField>

      <AdminUserInfoField label="Verification">
        <AdminUserVerificationBadge isVerified={user.isEmailVerified} />
      </AdminUserInfoField>

      <AdminUserInfoField label="Registered">
        {formatDisplayDate(user.createdAt)}
      </AdminUserInfoField>
    </div>
  </section>
);
