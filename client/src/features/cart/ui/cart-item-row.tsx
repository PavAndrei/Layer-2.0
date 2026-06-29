import { Link } from 'react-router';

import { formatProductPrice } from '../../../entities/product';
import type { CartItem } from '../model';
import { CartQuantityControl } from './cart-quantity-control';

type CartItemRowProps = {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

const buildProductUrl = (item: CartItem) => {
  const searchParams = new URLSearchParams({
    color: item.color,
    size: item.size,
  });

  return `/products/${item.productId}?${searchParams.toString()}`;
};

export const CartItemRow = ({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemRowProps) => {
  const productUrl = buildProductUrl(item);
  const lineTotal = item.price * item.quantity;
  const compareAtLineTotal =
    item.compareAtPrice !== undefined
      ? item.compareAtPrice * item.quantity
      : null;
  const stockMessage =
    item.quantity === item.maxQuantity
      ? 'Max available selected'
      : `${item.maxQuantity} available`;

  return (
    <article className="grid gap-4 rounded border border-border-soft bg-background-surface p-3 sm:grid-cols-[8rem_1fr]">
      <Link
        to={productUrl}
        className="aspect-4/5 overflow-hidden rounded bg-background-secondary"
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <Link to={productUrl} className="group w-fit">
              <h2 className="block-title text-typography-heading underline-offset-4 transition-colors group-hover:text-accent-hover group-hover:underline">
                {item.title}
              </h2>
            </Link>
            <p className="block-small text-typography-secondary">
              {item.color} / {item.size}
            </p>
            <p className="block-small text-typography-secondary">
              SKU: {item.sku}
            </p>
          </div>

          <div className="flex flex-col gap-1 sm:items-end">
            <div className="flex items-center gap-2">
              {compareAtLineTotal !== null && (
                <span className="block-small text-typography-muted line-through">
                  {formatProductPrice(compareAtLineTotal)}
                </span>
              )}
              <span className="block-title text-typography-heading">
                {formatProductPrice(lineTotal)}
              </span>
            </div>
            <span className="block-small text-typography-secondary">
              {formatProductPrice(item.price)} each
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <CartQuantityControl
            quantity={item.quantity}
            canDecrease={item.quantity > 1}
            canIncrease={item.quantity < item.maxQuantity}
            stockMessage={stockMessage}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <button
            type="button"
            className="block-small text-typography-secondary underline-offset-4 transition-colors hover:text-accent-hover hover:underline cursor-pointer"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};
