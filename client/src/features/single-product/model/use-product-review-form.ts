import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import type {
  ProductReviewFormErrors,
  ProductReviewFormValues,
} from './product-review-form-types';
import {
  getProductReviewFieldErrors,
  productReviewSchema,
} from './review-validation';
import { useCreateProductReview } from './use-create-product-review';

type UseProductReviewFormOptions = {
  onCreated?: () => void;
  productId: string;
  productIdentifier?: string;
};

const initialValues: ProductReviewFormValues = {
  rating: 5,
  text: '',
  title: '',
};

const getCreateReviewErrorMessage = (message: string) => {
  if (message.toLowerCase().includes('already reviewed')) {
    return 'You have already reviewed this product.';
  }

  return message;
};

export const useProductReviewForm = ({
  onCreated,
  productId,
  productIdentifier,
}: UseProductReviewFormOptions) => {
  const createReviewMutation = useCreateProductReview({
    productId,
    productIdentifier,
  });
  const [values, setValues] =
    useState<ProductReviewFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] =
    useState<ProductReviewFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    setFieldErrors({});
    setError(null);
    setIsCreated(false);
  }, [productId]);

  const updateField = <Field extends keyof ProductReviewFormValues>(
    field: Field,
    value: ProductReviewFormValues[Field],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (createReviewMutation.isPending || isCreated) return;

    setError(null);
    setFieldErrors({});

    const validationResult = productReviewSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(getProductReviewFieldErrors(validationResult.error));
      return;
    }

    createReviewMutation.mutate(validationResult.data, {
      onSuccess: (response) => {
        if (!response.success) {
          setError(getCreateReviewErrorMessage(response.message));
          return;
        }

        setIsCreated(true);
        setValues(initialValues);
        onCreated?.();
      },
      onError: (error) => {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to create review',
        );
      },
    });
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isCreated,
    isSubmitting: createReviewMutation.isPending,
    updateField,
    values,
  };
};
