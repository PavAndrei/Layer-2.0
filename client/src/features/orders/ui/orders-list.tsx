import type { Order } from '../../../entities/order';
import { OrderListItem } from './order-list-item';

type OrdersListProps = {
  orders: Order[];
};

export const OrdersList = ({ orders }: OrdersListProps) => (
  <div className="flex flex-col gap-3">
    {orders.map((order) => (
      <OrderListItem key={order._id} order={order} />
    ))}
  </div>
);
