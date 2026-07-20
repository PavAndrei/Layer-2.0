import type { AdminOrder } from '../../../entities/order';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import {
  AdminOrderPaymentStatusBadge,
  AdminOrderStatusBadge,
} from './admin-order-badges';

type AdminOrderDetailSummaryProps = {
  order: AdminOrder;
};

export const AdminOrderDetailSummary = ({
  order,
}: AdminOrderDetailSummaryProps) => (
  <section className="flex h-fit flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 lg:sticky lg:top-4">
    <div className="flex flex-col gap-1">
      <h2 className="block-title text-typography-heading">Summary</h2>
      <p className="block-small text-typography-secondary">
        Created {formatDisplayDate(order.createdAt)}
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      <AdminOrderStatusBadge status={order.status} />
      <AdminOrderPaymentStatusBadge status={order.paymentStatus} />
    </div>

    <div className="flex flex-col gap-2 border-t border-border-soft pt-4">
      <div className="flex items-center justify-between gap-4">
        <span className="block-medium text-typography-secondary">Items</span>
        <span className="block-medium text-typography-heading">
          {order.itemsCount}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="block-medium text-typography-secondary">
          Subtotal
        </span>
        <span className="block-medium text-typography-heading">
          {formatProductPrice(order.subtotal)}
        </span>
      </div>
      {order.discountTotal > 0 && (
        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Discount
          </span>
          <span className="block-medium text-accent-secondary">
            -{formatProductPrice(order.discountTotal)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-3">
        <span className="block-title text-typography-heading">Total</span>
        <span className="block-title text-typography-heading">
          {formatProductPrice(order.total)}
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-1 border-t border-border-soft pt-4">
      <span className="block-small text-typography-secondary">
        Last update
      </span>
      <span className="block-medium text-typography-heading">
        {formatDisplayDate(order.updatedAt)}
      </span>
    </div>
  </section>
);
