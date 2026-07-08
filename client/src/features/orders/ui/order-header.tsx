import { Breadcrumbs } from '../../../shared/ui';
import type { OrderStatus } from '../../../entities/order';
import { OrderStatusBadge } from './order-status-badge';

type OrderHeaderProps = {
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
};

const orderBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Profile', to: '/profile' },
  { label: 'Order' },
];

export const OrderHeader = ({
  orderNumber,
  placedAt,
  status,
}: OrderHeaderProps) => (
  <div className="flex flex-col gap-4 pb-4">
    <Breadcrumbs items={orderBreadcrumbs} />

    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="heading text-typography-heading">
          Order #{orderNumber}
        </h1>
        <p className="description text-typography-secondary">
          Placed on {placedAt}. Your order details are below.
        </p>
      </div>

      <OrderStatusBadge status={status} />
    </div>
  </div>
);

export const OrderHeaderFallback = () => (
  <div className="flex flex-col gap-4 pb-4">
    <Breadcrumbs items={orderBreadcrumbs} />

    <div className="flex flex-col gap-2">
      <h1 className="heading text-typography-heading">Order details</h1>
      <p className="description text-typography-secondary">
        Review your order details and delivery information.
      </p>
    </div>
  </div>
);
