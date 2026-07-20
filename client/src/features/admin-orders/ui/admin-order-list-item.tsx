import { Link } from 'react-router';

import type { AdminOrderListItem as AdminOrderListItemData } from '../../../entities/order';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import {
  AdminOrderPaymentStatusBadge,
  AdminOrderStatusBadge,
} from './admin-order-badges';

type AdminOrderListItemProps = {
  order: AdminOrderListItemData;
};

export const AdminOrderListItem = ({
  order,
}: AdminOrderListItemProps) => {
  const hasTrackingNumber = Boolean(order.trackingNumber);

  return (
    <Link
      to={`/admin/orders/${order._id}`}
      className="block min-h-full rounded outline-none transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
    >
      <article className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 transition-colors hover:border-border-strong">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="block-title text-typography-heading">
              Order #{order.orderNumber}
            </h3>
            <p className="block-small text-typography-secondary">
              {formatDisplayDate(order.createdAt)}
            </p>
          </div>

          <span className="block-title text-typography-heading">
            {formatProductPrice(order.total)}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="block-medium text-typography-heading">
            {order.customerName || 'Customer'}
          </span>
          <span className="truncate block-small text-typography-secondary">
            {order.contactEmail}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="block-small text-typography-muted">Items</span>
            <span className="block-medium text-typography-primary">
              {order.itemsCount}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="block-small text-typography-muted">
              Tracking
            </span>
            <span
              className={`block-medium ${
                hasTrackingNumber
                  ? 'text-typography-primary'
                  : 'text-typography-muted'
              }`}
            >
              {order.trackingNumber ?? 'Not added'}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <AdminOrderStatusBadge status={order.status} />
          <AdminOrderPaymentStatusBadge status={order.paymentStatus} />
        </div>
      </article>
    </Link>
  );
};
