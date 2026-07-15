import { Link } from 'react-router';

import {
  ORDER_STATUSES,
  type OrderStatus,
} from '../../../entities/order';

type OrdersStatusTabsProps = {
  activeStatus: OrderStatus | null;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const getStatusTabClassName = (isActive: boolean) =>
  [
    'inline-flex min-h-9 shrink-0 items-center justify-center rounded border px-3 py-1.5 block-small transition-colors',
    isActive
      ? 'border-accent-primary bg-accent-primary text-background-surface'
      : 'border-border-strong bg-background-surface text-typography-primary hover:bg-background-secondary',
  ].join(' ');

export const OrdersStatusTabs = ({
  activeStatus,
}: OrdersStatusTabsProps) => (
  <div className="flex gap-2 overflow-x-auto" role="tablist">
    <Link
      to="/profile?section=orders"
      className={getStatusTabClassName(activeStatus === null)}
      role="tab"
      aria-selected={activeStatus === null}
    >
      All
    </Link>

    {ORDER_STATUSES.map((status) => (
      <Link
        key={status}
        to={`/profile?section=orders&status=${status}`}
        className={getStatusTabClassName(activeStatus === status)}
        role="tab"
        aria-selected={activeStatus === status}
      >
        {statusLabels[status]}
      </Link>
    ))}
  </div>
);
