import { formatProductPrice } from '../../../entities/product';
import type {
  CheckoutSummaryItem,
  CheckoutSummaryTotals,
} from '../model';

type CheckoutOrderSummaryProps = {
  items: CheckoutSummaryItem[];
  totals: CheckoutSummaryTotals;
};

const getSummaryItemKey = (item: CheckoutSummaryItem) =>
  `${item.productId}:${item.variantId}`;

export const CheckoutOrderSummary = ({
  items,
  totals,
}: CheckoutOrderSummaryProps) => (
  <aside className="order-1 flex h-fit flex-col gap-4 rounded border border-border-soft bg-background-surface p-4 lg:sticky lg:top-4 lg:order-2">
    <h2 className="block-title text-typography-heading">Order summary</h2>

    <div className="flex flex-col divide-y divide-border-soft">
      {items.map((item) => (
        <div
          key={getSummaryItemKey(item)}
          className="flex gap-3 py-3 first:pt-0 last:pb-0"
        >
          <img
            alt={item.title}
            className="size-16 rounded border border-border-soft object-cover"
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

    <div className="flex flex-col gap-2 border-t border-border-soft pt-4">
      <div className="flex items-center justify-between gap-4">
        <span className="block-medium text-typography-secondary">Items</span>
        <span className="block-medium text-typography-heading">
          {totals.itemsCount}
        </span>
      </div>
      {totals.discountTotal > 0 && (
        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Discount
          </span>
          <span className="block-medium text-accent-secondary">
            -{formatProductPrice(totals.discountTotal)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-3">
        <span className="block-title text-typography-heading">Total</span>
        <span className="block-title text-typography-heading">
          {formatProductPrice(totals.subtotal)}
        </span>
      </div>
    </div>
  </aside>
);
