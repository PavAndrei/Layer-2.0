import { Link } from 'react-router';

import { formatProductPrice } from '../../../entities/product';
import type { Order } from '../../../entities/order';
import { formatDisplayDate } from '../../../shared/lib';
import { OrderStatusBadge } from './order-status-badge';

type OrderListItemProps = {
  order: Order;
};

const getOrderNumber = (orderId: string) => {
  return orderId.slice(-8).toUpperCase();
};

export const OrderListItem = ({ order }: OrderListItemProps) => (
  <Link
    to={`/orders/${order._id}`}
    className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 transition-colors hover:border-border-strong"
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="block-title text-typography-heading">
          Order #{getOrderNumber(order._id)}
        </span>
        <span className="block-small text-typography-secondary">
          Placed on {formatDisplayDate(order.createdAt)}
        </span>
      </div>

      <OrderStatusBadge status={order.status} />
    </div>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="block-medium text-typography-secondary">
        {order.items.length} item{order.items.length === 1 ? '' : 's'}
      </span>
      <span className="block-title text-typography-heading">
        {formatProductPrice(order.total)}
      </span>
    </div>
  </Link>
);
