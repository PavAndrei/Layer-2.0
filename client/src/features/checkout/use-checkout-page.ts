import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

import {
  getCartTotals,
  selectCartItems,
  useCartStore,
} from '../cart';
import { useProfile } from '../profile';
import {
  checkoutSchema,
  getCheckoutFieldErrors,
  useCheckout,
} from './model';
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
  CheckoutShippingAddressField,
  CheckoutSummaryItem,
  CheckoutSummaryTotals,
} from './model';

const initialValues: CheckoutFormValues = {
  contactEmail: '',
  shippingAddress: {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    phone: '',
  },
};

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
): CheckoutSummaryTotals => ({
  discountTotal: totals.discountTotal,
  itemsCount: totals.itemsCount,
  subtotal: totals.subtotal,
});

export const useCheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore(selectCartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const items = useMemo(() => toSummaryItems(cartItems), [cartItems]);
  const totals = useMemo(() => toSummaryTotals(cartTotals), [cartTotals]);
  const profileQuery = useProfile();
  const profileResponse = profileQuery.data;
  const checkoutMutation = useCheckout();
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({});

  useEffect(() => {
    if (!profileResponse?.success || values.contactEmail) return;

    setValues((currentValues) => ({
      ...currentValues,
      contactEmail: profileResponse.data.user.email,
    }));
  }, [profileResponse, values.contactEmail]);

  const updateContactEmail = (contactEmail: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      contactEmail,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      contactEmail: undefined,
    }));
    setError(null);
  };

  const updateShippingAddress = (
    field: CheckoutShippingAddressField,
    value: string,
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      shippingAddress: {
        ...currentValues.shippingAddress,
        [field]: value,
      },
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      shippingAddress: {
        ...currentErrors.shippingAddress,
        [field]: undefined,
      },
    }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkoutMutation.isPending || cartItems.length === 0) return;

    setError(null);
    setFieldErrors({});

    const validationResult = checkoutSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(getCheckoutFieldErrors(validationResult.error));
      return;
    }

    checkoutMutation.mutate(
      {
        ...validationResult.data,
        items: cartItems.map(({ productId, quantity, variantId }) => ({
          productId,
          quantity,
          variantId,
        })),
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            setError(response.message);
            return;
          }

          clearCart();
          navigate(`/orders/${response.data.order._id}`, { replace: true });
        },
        onError: (error) => {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to complete checkout',
          );
        },
      },
    );
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isEmpty: cartItems.length === 0,
    isSubmitting: checkoutMutation.isPending,
    items,
    totals,
    updateContactEmail,
    updateShippingAddress,
    values,
  };
};
