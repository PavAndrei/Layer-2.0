import { useMemo } from 'react';

import { useScrollToTopOnChange } from '../../../shared/hooks';
import { getCartItemKey, getCartTotals } from './cart-helpers';
import { selectCartItems } from './cart-selectors';
import { useCartStore } from './cart-store';

export const useCartPage = () => {
  const items = useCartStore(selectCartItems);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const increaseItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );
  const decreaseItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity,
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useScrollToTopOnChange('cart-page', { skipInitialScroll: false });

  return {
    clearCart,
    decreaseItemQuantity,
    getCartItemKey,
    increaseItemQuantity,
    isEmpty: items.length === 0,
    items,
    removeItem,
    totals,
  };
};
