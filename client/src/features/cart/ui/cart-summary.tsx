import { Link } from 'react-router';

import { formatProductPrice } from '../../../entities/product';
import { Button } from '../../../shared/ui';
import type { CartTotals } from '../model';
import { useCartSummary } from './use-cart-summary';

type CartSummaryProps = {
  totals: CartTotals;
  onClearCart: () => void;
};

export const CartSummary = ({ totals, onClearCart }: CartSummaryProps) => {
  const {
    closeClearConfirm,
    handleClearCart,
    isClearConfirmOpen,
    openClearConfirm,
  } = useCartSummary({ onClearCart });

  return (
    <section className="sticky top-4 flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <h2 className="block-title text-typography-heading">Order Summary</h2>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Items
          </span>
          <span className="block-medium text-typography-heading">
            {totals.itemsCount}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="block-medium text-typography-secondary">
            Subtotal
          </span>
          <span className="block-medium text-typography-heading">
            {formatProductPrice(totals.subtotal)}
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
      </div>

      <div className="border-t border-border-soft pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="block-title text-typography-heading">Total</span>
          <span className="block-title text-typography-heading">
            {formatProductPrice(totals.subtotal)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/catalog"
          className="inline-flex min-h-10 w-full items-center justify-center rounded border border-border-strong bg-background-surface px-4 py-2 block-medium text-typography-primary transition-[color,background-color,border-color,transform] duration-150 ease-out hover:bg-background-secondary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black"
        >
          Continue Shopping
        </Link>
        <div className="flex flex-col gap-1">
          <Button disabled variant="primary" className="w-full">
            Checkout
          </Button>
          <p className="block-small text-typography-secondary">
            Checkout will be available soon.
          </p>
        </div>
        {isClearConfirmOpen ? (
          <div className="flex flex-col gap-2 rounded border border-border-soft bg-background-primary p-3">
            <p className="block-small text-typography-secondary">
              Clear all items from your cart?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={closeClearConfirm}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={handleClearCart}
              >
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full"
            onClick={openClearConfirm}
          >
            Clear Cart
          </Button>
        )}
      </div>
    </section>
  );
};
