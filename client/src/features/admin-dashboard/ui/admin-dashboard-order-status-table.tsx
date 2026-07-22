import { Link } from 'react-router';

import type { OrderStatus } from '../../../entities/order';
import type { AdminDashboardOrderStatusItem } from '../api';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  paid: 'Paid',
  pending: 'Pending',
  processing: 'Processing',
};

type AdminDashboardOrderStatusTableProps = {
  distribution: AdminDashboardOrderStatusItem[];
};

export const AdminDashboardOrderStatusTable = ({
  distribution,
}: AdminDashboardOrderStatusTableProps) => (
  <section className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">
        Order statuses
      </h3>
      <p className="block-small text-typography-secondary">
        Current distribution across all orders.
      </p>
    </div>

    {distribution.length === 0 ? (
      <p className="block-small text-typography-secondary">
        No orders found.
      </p>
    ) : (
      <div className="flex flex-col divide-y divide-border-soft">
        {distribution.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between gap-3 py-3"
          >
            <span className="block-medium text-typography-primary">
              {ORDER_STATUS_LABELS[item.status]}
            </span>
            <span className="block-title text-typography-heading">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    )}

    <Link
      to="/admin?section=orders"
      className="mt-auto block-small text-accent-primary transition-colors hover:text-accent-hover hover:underline"
    >
      View orders
    </Link>
  </section>
);
