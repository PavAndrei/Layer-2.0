import { useCartPage } from './model';
import {
  CartEmptyState,
  CartItemRow,
  CartLayout,
  CartSummary,
} from './ui';

export const CartPage = () => {
  const {
    clearCart,
    decreaseItemQuantity,
    getCartItemKey,
    increaseItemQuantity,
    isEmpty,
    items,
    removeItem,
    totals,
  } = useCartPage();

  if (isEmpty) {
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
