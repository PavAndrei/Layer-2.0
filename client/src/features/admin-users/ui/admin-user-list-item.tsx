import { Link } from 'react-router';

import type { AdminUserListItem as AdminUserListItemData } from '../../../entities/user';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import {
  AdminUserProviderBadges,
  AdminUserRoleBadge,
  AdminUserStatusBadge,
  AdminUserVerificationBadge,
} from './admin-user-badges';

type AdminUserListItemProps = {
  user: AdminUserListItemData;
};

export const AdminUserListItem = ({ user }: AdminUserListItemProps) => (
  <Link
    to={`/admin/users/${user._id}`}
    className="block min-h-full rounded transition-colors hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-strong"
  >
    <article className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate block-title text-typography-heading">
            {user.name}
          </h3>
          <p className="truncate block-small text-typography-secondary">
            {user.email}
          </p>
        </div>

        <AdminUserStatusBadge status={user.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminUserRoleBadge role={user.role} />
        <AdminUserVerificationBadge isVerified={user.isEmailVerified} />
      </div>

      <AdminUserProviderBadges providers={user.authProviders} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="block-small text-typography-muted">Orders</span>
          <span className="block-medium text-typography-primary">
            {user.ordersCount}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="block-small text-typography-muted">Total spent</span>
          <span className="block-medium text-typography-primary">
            {formatProductPrice(user.totalSpent)}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-border-soft pt-3">
        <time
          className="block-small text-typography-muted"
          dateTime={user.createdAt}
        >
          Joined {formatDisplayDate(user.createdAt)}
        </time>
        <time
          className="block-small text-typography-muted"
          dateTime={user.updatedAt}
        >
          Updated {formatDisplayDate(user.updatedAt)}
        </time>
      </div>
    </article>
  </Link>
);
