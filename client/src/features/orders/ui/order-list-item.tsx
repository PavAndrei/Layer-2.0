import { Link } from 'react-router';

import { formatProductPrice } from '../../../entities/product';
import {
  getOrderShippingLabel,
  type Order,
} from '../../../entities/order';
import { formatDisplayDate } from '../../../shared/lib';
import { OrderStatusBadge } from './order-status-badge';

type OrderListItemProps = {
  order: Order;
};

const MAX_VISIBLE_ITEMS = 3;

const getOrderNumber = (orderId: string) => {
  return orderId.slice(-8).toUpperCase();
};

const getShippingLocation = (order: Order) => {
  const { city, country } = order.shippingAddress;

  return [city, country].filter(Boolean).join(', ');
};

export const OrderListItem = ({ order }: OrderListItemProps) => {
  const visibleItems = order.items.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenItemsCount = Math.max(
    order.items.length - visibleItems.length,
    0,
  );
  const shippingLocation = getShippingLocation(order);
  const shippingLabel = getOrderShippingLabel(order, formatProductPrice);

  return (
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 -space-x-2">
            {visibleItems.map((item) => (
              <img
                key={`${item.productId}:${item.variantId}`}
                alt={item.title}
                className="size-12 rounded border border-background-surface bg-background-secondary object-cover"
                src={item.image}
              />
            ))}
            {hiddenItemsCount > 0 && (
              <span className="inline-flex size-12 items-center justify-center rounded border border-border-soft bg-background-secondary block-small text-typography-secondary">
                +{hiddenItemsCount}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <span className="block-medium text-typography-heading">
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </span>
            {shippingLocation && (
              <span className="block-small truncate text-typography-secondary">
                Ships to {shippingLocation}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1 sm:items-end">
          <span className="block-title text-typography-heading">
            {formatProductPrice(order.total)}
          </span>
          <span className="block-small text-typography-secondary">
            Shipping {shippingLabel}
          </span>
          <span className="block-small text-accent-primary">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
};
