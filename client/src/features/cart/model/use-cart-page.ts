import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  calculateShippingTotal,
  useStoreSettings,
} from '../../../entities/store-settings';
import type {
  StoreShippingSettings,
} from '../../../entities/store-settings';
import { useScrollToTopOnChange } from '../../../shared/hooks';
import { getCartItemKey, getCartTotals } from './cart-helpers';
import { selectCartItems } from './cart-selectors';
import { useCartStore } from './cart-store';
import type { CartItemKey } from './cart-types';
import { useValidateCart } from './use-validate-cart';

type CartValidationNotice = {
  removedItemsCount: number;
  updatedItemsCount: number;
};

const toOrderTotals = (
  totals: ReturnType<typeof getCartTotals>,
  shippingSettings?: StoreShippingSettings | null,
) => {
  const shippingTotal = shippingSettings
    ? calculateShippingTotal({
      merchandiseTotal: totals.subtotal,
      shippingSettings,
    })
    : 0;

  return {
    estimatedDeliveryDaysMax: shippingSettings?.estimatedDeliveryDaysMax,
    estimatedDeliveryDaysMin: shippingSettings?.estimatedDeliveryDaysMin,
    shippingNotice: shippingSettings?.shippingNotice,
    shippingTotal,
    total: totals.subtotal + shippingTotal,
  };
};

export const useCartPage = () => {
  const items = useCartStore(selectCartItems);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const storeSettingsQuery = useStoreSettings();
  const shippingSettings = storeSettingsQuery.settings?.shipping ?? null;
  const orderTotals = useMemo(
    () => toOrderTotals(totals, shippingSettings),
    [shippingSettings, totals],
  );
  const [cartValidationNotice, setCartValidationNotice] =
    useState<CartValidationNotice | null>(null);
  const [cartValidationError, setCartValidationError] =
    useState<string | null>(null);
  const hasValidatedCartRef = useRef(false);
  const increaseCartItemQuantity = useCartStore(
    (state) => state.increaseItemQuantity,
  );
  const decreaseCartItemQuantity = useCartStore(
    (state) => state.decreaseItemQuantity,
  );
  const removeCartItem = useCartStore((state) => state.removeItem);
  const replaceCart = useCartStore((state) => state.replaceCart);
  const clearCartItems = useCartStore((state) => state.clearCart);
  const { isPending: isCartValidating, mutate: validateCart } =
    useValidateCart();

  useScrollToTopOnChange('cart-page', { skipInitialScroll: false });

  const validateCurrentCart = useCallback(() => {
    if (items.length === 0) return;

    setCartValidationError(null);
    hasValidatedCartRef.current = true;

    validateCart(items, {
      onSuccess: ({ items: validatedItems, removedItems, updatedItems }) => {
        replaceCart(validatedItems);
        setCartValidationNotice(
          removedItems.length > 0 || updatedItems.length > 0
            ? {
                removedItemsCount: removedItems.length,
                updatedItemsCount: updatedItems.length,
              }
            : null,
        );
      },
      onError: (error) => {
        hasValidatedCartRef.current = false;
        setCartValidationError(
          error instanceof Error
            ? error.message
            : 'Could not refresh cart',
        );
      },
    });
  }, [items, replaceCart, validateCart]);

  const resetCartValidationState = useCallback(() => {
    setCartValidationNotice(null);
    setCartValidationError(null);
  }, []);

  const clearCart = useCallback(() => {
    resetCartValidationState();
    clearCartItems();
  }, [clearCartItems, resetCartValidationState]);

  const decreaseItemQuantity = useCallback(
    (key: CartItemKey) => {
      resetCartValidationState();
      decreaseCartItemQuantity(key);
    },
    [decreaseCartItemQuantity, resetCartValidationState],
  );

  const increaseItemQuantity = useCallback(
    (key: CartItemKey) => {
      resetCartValidationState();
      increaseCartItemQuantity(key);
    },
    [increaseCartItemQuantity, resetCartValidationState],
  );

  const removeItem = useCallback(
    (key: CartItemKey) => {
      resetCartValidationState();
      removeCartItem(key);
    },
    [removeCartItem, resetCartValidationState],
  );

  useEffect(() => {
    if (items.length > 0) return;

    hasValidatedCartRef.current = false;
    setCartValidationError(null);
  }, [items.length]);

  useEffect(() => {
    if (hasValidatedCartRef.current || items.length === 0) return;

    validateCurrentCart();
  }, [items.length, validateCurrentCart]);

  return {
    cartValidationError,
    cartValidationNotice,
    clearCart,
    decreaseItemQuantity,
    getCartItemKey,
    increaseItemQuantity,
    isCartValidating,
    isEmpty: items.length === 0,
    isShippingLoading: storeSettingsQuery.isLoading,
    items,
    orderTotals,
    removeItem,
    retryCartValidation: validateCurrentCart,
    shippingError: storeSettingsQuery.error,
    totals,
  };
};
