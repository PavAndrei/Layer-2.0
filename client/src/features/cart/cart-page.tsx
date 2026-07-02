import { Button, FeedbackMessage } from '../../shared/ui';
import { useCartPage } from './model';
import {
  CartEmptyState,
  CartItemRow,
  CartLayout,
  CartSummary,
} from './ui';

type CartValidationNotice = {
  removedItemsCount: number;
  updatedItemsCount: number;
};

const getCartValidationNoticeDescription = ({
  removedItemsCount,
  updatedItemsCount,
}: CartValidationNotice) => {
  const messages: string[] = [];

  if (removedItemsCount > 0) {
    messages.push(
      `${removedItemsCount} unavailable item${
        removedItemsCount === 1 ? '' : 's'
      } removed.`,
    );
  }

  if (updatedItemsCount > 0) {
    messages.push(
      `Quantity adjusted for ${updatedItemsCount} item${
        updatedItemsCount === 1 ? '' : 's'
      }.`,
    );
  }

  return messages.join(' ');
};

export const CartPage = () => {
  const {
    cartValidationError,
    cartValidationNotice,
    clearCart,
    decreaseItemQuantity,
    getCartItemKey,
    increaseItemQuantity,
    isCartValidating,
    isEmpty,
    items,
    removeItem,
    retryCartValidation,
    totals,
  } = useCartPage();

  const validationFeedback = (
    <>
      {cartValidationError && (
        <FeedbackMessage
          title="Could not refresh cart"
          description={cartValidationError}
          tone="danger"
          action={
            <Button
              size="sm"
              variant="secondary"
              disabled={isCartValidating}
              onClick={retryCartValidation}
            >
              Try again
            </Button>
          }
        />
      )}

      {cartValidationNotice && (
        <FeedbackMessage
          title="Cart was updated"
          description={getCartValidationNoticeDescription(
            cartValidationNotice,
          )}
        />
      )}
    </>
  );

  if (isEmpty) {
    return (
      <CartLayout itemsCount={0}>
        <div className="flex flex-col gap-3">
          {validationFeedback}
          <CartEmptyState />
        </div>
      </CartLayout>
    );
  }

  return (
    <CartLayout
      itemsCount={totals.itemsCount}
      summary={<CartSummary totals={totals} onClearCart={clearCart} />}
    >
      <div className="flex flex-col gap-3">
        {isCartValidating && (
          <p className="block-small text-typography-secondary">
            Checking product availability...
          </p>
        )}

        {validationFeedback}

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
