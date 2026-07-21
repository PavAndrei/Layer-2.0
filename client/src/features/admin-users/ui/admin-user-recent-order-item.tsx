import { Link } from 'react-router';

import type {
  AdminUserRecentOrder,
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';

type AdminUserRecentOrderItemProps = {
  order: AdminUserRecentOrder;
};

const orderStatusLabels: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  paid: 'Paid',
  pending: 'Pending',
  processing: 'Processing',
};

const paymentStatusLabels: Record<OrderPaymentStatus, string> = {
  failed: 'Payment failed',
  paid: 'Paid',
  pending: 'Payment pending',
  refunded: 'Refunded',
};

const orderStatusClasses: Record<OrderStatus, string> = {
  cancelled:
    'border-border-strong bg-background-secondary text-typography-muted',
  completed:
    'border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary',
  paid: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  processing:
    'border-accent-primary/30 bg-background-secondary text-accent-primary',
};

const paymentStatusClasses: Record<OrderPaymentStatus, string> = {
  failed:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
  paid: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  refunded:
    'border-border-strong bg-background-secondary text-typography-muted',
};

const AdminUserRecentOrderStatusBadge = ({
  status,
}: {
  status: OrderStatus;
}) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${orderStatusClasses[status]}`}
  >
    {orderStatusLabels[status]}
  </span>
);

const AdminUserRecentOrderPaymentBadge = ({
  status,
}: {
  status: OrderPaymentStatus;
}) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${paymentStatusClasses[status]}`}
  >
    {paymentStatusLabels[status]}
  </span>
);

export const AdminUserRecentOrderItem = ({
  order,
}: AdminUserRecentOrderItemProps) => (
  <li className="grid gap-3 border-t border-border-soft py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[minmax(8rem,1fr)_minmax(8rem,1fr)_minmax(9rem,auto)_minmax(11rem,auto)_minmax(6rem,auto)_auto] md:items-center">
    <div className="flex min-w-0 flex-col gap-1">
      <span className="block-small text-typography-secondary">Order</span>
      <span className="truncate block-medium text-typography-heading">
        #{order.orderNumber}
      </span>
    </div>

    <div className="flex flex-col gap-1">
      <span className="block-small text-typography-secondary">Date</span>
      <time
        className="block-medium text-typography-heading"
        dateTime={order.createdAt}
      >
        {formatDisplayDate(order.createdAt)}
      </time>
    </div>

    <AdminUserRecentOrderStatusBadge status={order.status} />

    <AdminUserRecentOrderPaymentBadge status={order.paymentStatus} />

    <div className="flex flex-col gap-1 md:text-right">
      <span className="block-small text-typography-secondary">Total</span>
      <span className="block-medium text-typography-heading">
        {formatProductPrice(order.total)}
      </span>
    </div>

    <Link
      to={`/admin/orders/${order._id}`}
      className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
    >
      View order
    </Link>
  </li>
);
