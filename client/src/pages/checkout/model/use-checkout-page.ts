import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import {
  calculateShippingTotal,
  useStoreSettings,
} from '../../../entities/store-settings';
import type {
  StoreShippingSettings,
} from '../../../entities/store-settings';
import {
  getCartTotals,
  selectCartItems,
  useCartStore,
} from '../../../features/cart';
import { useProfile } from '../../../features/profile';
import { useCheckoutForm } from '../../../features/checkout';
import type {
  CheckoutSummaryItem,
  CheckoutSummaryTotals,
} from '../../../features/checkout';

const toSummaryItems = (items: ReturnType<typeof selectCartItems>) =>
  items.map(
    ({
      color,
      image,
      price,
      productId,
      quantity,
      size,
      title,
      variantId,
    }): CheckoutSummaryItem => ({
      color,
      image,
      price,
      productId,
      quantity,
      size,
      title,
      variantId,
    }),
  );

const toSummaryTotals = (
  totals: ReturnType<typeof getCartTotals>,
  shippingSettings?: StoreShippingSettings | null,
): CheckoutSummaryTotals => {
  const shippingTotal = shippingSettings
    ? calculateShippingTotal({
      merchandiseTotal: totals.subtotal,
      shippingSettings,
    })
    : 0;

  return {
    estimatedDeliveryDaysMax: shippingSettings?.estimatedDeliveryDaysMax,
    estimatedDeliveryDaysMin: shippingSettings?.estimatedDeliveryDaysMin,
    discountTotal: totals.discountTotal,
    itemsCount: totals.itemsCount,
    shippingNotice: shippingSettings?.shippingNotice,
    shippingTotal,
    subtotal: totals.compareAtSubtotal,
    total: totals.subtotal + shippingTotal,
  };
};

export const useCheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore(selectCartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const items = useMemo(() => toSummaryItems(cartItems), [cartItems]);
  const storeSettingsQuery = useStoreSettings();
  const shippingSettings = storeSettingsQuery.settings?.shipping ?? null;
  const totals = useMemo(
    () => toSummaryTotals(cartTotals, shippingSettings),
    [cartTotals, shippingSettings],
  );
  const profileQuery = useProfile();
  const profileResponse = profileQuery.data;
  const checkoutItems = useMemo(
    () =>
      cartItems.map(({ productId, quantity, variantId }) => ({
        productId,
        quantity,
        variantId,
      })),
    [cartItems],
  );
  const checkoutForm = useCheckoutForm({
    defaultContactEmail: profileResponse?.success
      ? profileResponse.data.user.email
      : undefined,
    isSubmitDisabled: cartItems.length === 0,
    items: checkoutItems,
    onSuccess: (response) => {
      if (!response.success) return;

      clearCart();
      navigate(`/orders/${response.data.order._id}`, { replace: true });
    },
  });

  return {
    error: checkoutForm.error,
    fieldErrors: checkoutForm.fieldErrors,
    handleSubmit: checkoutForm.handleSubmit,
    isEmpty: cartItems.length === 0,
    isShippingLoading: storeSettingsQuery.isLoading,
    isSubmitting: checkoutForm.isSubmitting,
    items,
    shippingError: storeSettingsQuery.error,
    totals,
    updateContactEmail: checkoutForm.updateContactEmail,
    updateShippingAddress: checkoutForm.updateShippingAddress,
    values: checkoutForm.values,
  };
};
