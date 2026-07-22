import { Link } from 'react-router';

import type {
  AdminUserListItem,
  UserRole,
  UserStatus,
} from '../../../entities/user';
import { formatDisplayDate } from '../../../shared/lib';

const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
};

const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  blocked: 'Blocked',
};

type AdminDashboardRecentUsersProps = {
  users: AdminUserListItem[];
};

export const AdminDashboardRecentUsers = ({
  users,
}: AdminDashboardRecentUsersProps) => (
  <section className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">Recent users</h3>
      <p className="block-small text-typography-secondary">
        Latest customer registrations.
      </p>
    </div>

    {users.length === 0 ? (
      <p className="block-small text-typography-secondary">
        No users found in this period.
      </p>
    ) : (
      <div className="flex flex-col divide-y divide-border-soft">
        {users.map((user) => (
          <Link
            key={user._id}
            to={`/admin/users/${user._id}`}
            className="flex flex-col gap-2 py-3 outline-none transition-colors hover:bg-background-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate block-medium text-typography-heading">
                {user.name}
              </p>
              <p className="truncate block-small text-typography-secondary">
                {user.email}
              </p>
              <p className="block-small text-typography-muted">
                Joined {formatDisplayDate(user.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:items-end">
              <span className="block-small text-typography-secondary">
                {USER_ROLE_LABELS[user.role]}
              </span>
              <span className="block-small text-typography-secondary">
                {USER_STATUS_LABELS[user.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    )}

    <Link
      to="/admin?section=users"
      className="mt-auto block-small text-accent-primary transition-colors hover:text-accent-hover hover:underline"
    >
      View all users
    </Link>
  </section>
);
