import { useMemo } from 'react';

import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  getCartTotals,
  getCartItemKey,
  selectCartItems,
  useCartStore,
} from './model';
import {
  CartEmptyState,
  CartItemRow,
  CartLayout,
  CartSummary,
} from './ui';

export const CartPage = () => {
  const items = useCartStore(selectCartItems);
  const totals = useMemo(() => getCartTotals(items), [items]);
  useScrollToTopOnChange('cart-page', { skipInitialScroll: false });
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );
  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity,
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <CartLayout itemsCount={0}>
        <CartEmptyState />
      </CartLayout>
    );
  }

  return (
    <CartLayout
      itemsCount={totals.itemsCount}
      summary={<CartSummary totals={totals} onClearCart={clearCart} />}
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const itemKey = getCartItemKey(item.productId, item.variantId);

          return (
            <CartItemRow
              key={itemKey}
              item={item}
              onDecrease={() => decreaseItemQuantity(itemKey)}
              onIncrease={() => increaseItemQuantity(itemKey)}
              onRemove={() => removeItem(itemKey)}
            />
          );
        })}
      </div>
    </CartLayout>
  );
};
