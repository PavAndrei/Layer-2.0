import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import type {
  ProductReviewFormErrors,
  ProductReviewFormValues,
} from './product-review-form-types';
import {
  getProductReviewFieldErrors,
  productReviewSchema,
} from './review-validation';

type ProductReviewSubmitResult = {
  message?: string;
  success: boolean;
};

type UseProductReviewFormOptions = {
  isSubmitting: boolean;
  onCreateReview: (
    review: ProductReviewFormValues,
  ) => Promise<ProductReviewSubmitResult>;
  onCreated?: () => void;
  productId: string;
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
  isSubmitting,
  onCreateReview,
  onCreated,
  productId,
}: UseProductReviewFormOptions) => {
  const [values, setValues] =
    useState<ProductReviewFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] =
    useState<ProductReviewFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setFieldErrors({});
    setError(null);
    setIsCreated(false);
  }, []);

  useEffect(() => {
    resetForm();
  }, [productId, resetForm]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isCreated) return;

    setError(null);
    setFieldErrors({});

    const validationResult = productReviewSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(getProductReviewFieldErrors(validationResult.error));
      return;
    }

    try {
      const response = await onCreateReview(validationResult.data);

      if (!response.success) {
        setError(
          getCreateReviewErrorMessage(
            response.message ?? 'Failed to create review',
          ),
        );
        return;
      }

      setIsCreated(true);
      setValues(initialValues);
      onCreated?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create review',
      );
    }
  };

  return {
    error,
    fieldErrors,
    handleSubmit,
    isCreated,
    isSubmitting,
    resetForm,
    updateField,
    values,
  };
};
