import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import type { ApiResponse } from '../../../shared/api';
import type {
  CheckoutPayload,
  CheckoutResponseData,
} from '../api';
import {
  checkoutSchema,
  getCheckoutFieldErrors,
} from './checkout-validation';
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
  CheckoutShippingAddressField,
} from './checkout-types';
import { useCheckout } from './use-checkout';

type UseCheckoutFormParams = {
  defaultContactEmail?: string;
  isSubmitDisabled?: boolean;
  items: CheckoutPayload['items'];
  onSuccess?: (response: ApiResponse<CheckoutResponseData>) => void;
};

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

export const useCheckoutForm = ({
  defaultContactEmail,
  isSubmitDisabled = false,
  items,
  onSuccess,
}: UseCheckoutFormParams) => {
  const checkoutMutation = useCheckout();
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({});

  useEffect(() => {
    if (!defaultContactEmail || values.contactEmail) return;

    setValues((currentValues) => ({
      ...currentValues,
      contactEmail: defaultContactEmail,
    }));
  }, [defaultContactEmail, values.contactEmail]);

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

    if (checkoutMutation.isPending || isSubmitDisabled) return;

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
        items,
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            setError(response.message);
            return;
          }

          onSuccess?.(response);
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
    isSubmitting: checkoutMutation.isPending,
    updateContactEmail,
    updateShippingAddress,
    values,
  };
};
