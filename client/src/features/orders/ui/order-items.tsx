import { formatProductPrice } from '../../../entities/product';
import type { OrderItemSnapshot } from '../../../entities/order';

type OrderItemsProps = {
  items: OrderItemSnapshot[];
};

const getOrderItemKey = (item: OrderItemSnapshot) =>
  `${item.productId}:${item.variantId}`;

export const OrderItems = ({ items }: OrderItemsProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <h2 className="block-title text-typography-heading">Items</h2>

    <div className="flex flex-col divide-y divide-border-soft">
      {items.map((item) => (
        <div
          key={getOrderItemKey(item)}
          className="flex gap-3 py-4 first:pt-0 last:pb-0"
        >
          <img
            alt={item.title}
            className="size-20 rounded border border-border-soft object-cover"
            src={item.image}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="block-medium truncate text-typography-heading">
              {item.title}
            </p>
            <p className="block-small text-typography-secondary">
              {item.color} / {item.size} / Qty {item.quantity}
            </p>
            <p className="block-medium text-typography-heading">
              {formatProductPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
