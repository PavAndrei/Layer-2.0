import type { AdminOrderListItem as AdminOrderListItemData } from '../../../entities/order';
import { AdminOrderListItem } from './admin-order-list-item';

type AdminOrdersListProps = {
  orders: AdminOrderListItemData[];
};

export const AdminOrdersList = ({ orders }: AdminOrdersListProps) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {orders.map((order) => (
      <AdminOrderListItem key={order._id} order={order} />
    ))}
  </div>
);
