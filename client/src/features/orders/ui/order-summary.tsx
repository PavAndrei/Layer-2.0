import {
  getOrderShippingLabel,
  type OrderShippingSnapshot,
} from '../../../entities/order';
import { formatProductPrice } from '../../../entities/product';

type OrderSummaryProps = {
  discountTotal: number;
  shippingSnapshot?: OrderShippingSnapshot;
  shippingTotal: number;
  subtotal: number;
  total: number;
};

export const OrderSummary = ({
  discountTotal,
  shippingSnapshot,
  shippingTotal,
  subtotal,
  total,
}: OrderSummaryProps) => {
  const shippingLabel = getOrderShippingLabel(
    {
      shippingSnapshot,
      shippingTotal,
    },
    formatProductPrice,
  );

  return (
    <section className="flex h-fit flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 lg:sticky lg:top-4">
      <h2 className="block-title text-typography-heading">Summary</h2>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Subtotal
          </span>
          <span className="block-medium text-typography-heading">
            {formatProductPrice(subtotal)}
          </span>
        </div>

        {discountTotal > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="block-medium text-typography-secondary">
              Discount
            </span>
            <span className="block-medium text-accent-secondary">
              -{formatProductPrice(discountTotal)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Shipping
          </span>
          <span className="block-medium text-typography-heading">
            {shippingLabel}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-3">
          <span className="block-title text-typography-heading">Total</span>
          <span className="block-title text-typography-heading">
            {formatProductPrice(total)}
          </span>
        </div>
      </div>
    </section>
  );
};
