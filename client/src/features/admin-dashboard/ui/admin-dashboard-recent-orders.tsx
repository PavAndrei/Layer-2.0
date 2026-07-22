import { Link } from 'react-router';

import {
  getOrderShippingLabel,
  type AdminOrderListItem,
  type OrderPaymentStatus,
  type OrderStatus,
} from '../../../entities/order';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  paid: 'Paid',
  pending: 'Pending',
  processing: 'Processing',
};

const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  failed: 'Failed',
  paid: 'Paid',
  pending: 'Payment pending',
  refunded: 'Refunded',
};

type AdminDashboardRecentOrdersProps = {
  orders: AdminOrderListItem[];
};

export const AdminDashboardRecentOrders = ({
  orders,
}: AdminDashboardRecentOrdersProps) => (
  <section className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">Recent orders</h3>
      <p className="block-small text-typography-secondary">
        Latest customer checkout activity.
      </p>
    </div>

    {orders.length === 0 ? (
      <p className="block-small text-typography-secondary">
        No orders found in this period.
      </p>
    ) : (
      <div className="flex flex-col divide-y divide-border-soft">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/admin/orders/${order._id}`}
            className="flex flex-col gap-2 py-3 outline-none transition-colors hover:bg-background-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate block-medium text-typography-heading">
                Order #{order.orderNumber}
              </p>
              <p className="truncate block-small text-typography-secondary">
                {order.customerName || 'Customer'} · {order.contactEmail}
              </p>
              <p className="block-small text-typography-muted">
                {formatDisplayDate(order.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:items-end">
              <span className="block-medium text-typography-heading">
                {formatProductPrice(order.total)}
              </span>
              <span className="block-small text-typography-muted">
                Shipping{' '}
                {getOrderShippingLabel(order, formatProductPrice)}
              </span>
              <span className="block-small text-typography-secondary">
                {ORDER_STATUS_LABELS[order.status]} ·{' '}
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    )}

    <Link
      to="/admin?section=orders"
      className="mt-auto block-small text-accent-primary transition-colors hover:text-accent-hover hover:underline"
    >
      View all orders
    </Link>
  </section>
);
