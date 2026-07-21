import { Link } from 'react-router';

import type { AdminUserRecentOrder } from '../../../entities/order';
import { AdminUserRecentOrderItem } from './admin-user-recent-order-item';

type AdminUserRecentOrdersCardProps = {
  orders: AdminUserRecentOrder[];
  userId: string;
};

const getAllOrdersUrl = (userId: string) => {
  const searchParams = new URLSearchParams({
    section: 'orders',
    userId,
  });

  return `/admin?${searchParams.toString()}`;
};

export const AdminUserRecentOrdersCard = ({
  orders,
  userId,
}: AdminUserRecentOrdersCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="block-title text-typography-heading">Recent orders</h2>
        <p className="block-small text-typography-secondary">
          Latest five orders placed by this user.
        </p>
      </div>

      <Link
        to={getAllOrdersUrl(userId)}
        className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
      >
        View all orders
      </Link>
    </div>

    {orders.length > 0 ? (
      <ul className="flex flex-col">
        {orders.map((order) => (
          <AdminUserRecentOrderItem key={order._id} order={order} />
        ))}
      </ul>
    ) : (
      <div className="rounded border border-border-soft bg-background-secondary p-4">
        <p className="block-small text-typography-secondary">
          This user has not placed any orders yet.
        </p>
      </div>
    )}
  </section>
);
