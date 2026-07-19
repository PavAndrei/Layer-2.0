import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  getReviewFieldErrors,
  reviewSchema,
  type ReviewFormErrors,
  type ReviewFormValues,
} from '../../../entities/review';
import type { EditableReview } from './use-update-review-action';

type ReviewSubmitResult = {
  message?: string;
  success: boolean;
};

type UseReviewEditFormOptions = {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (review: ReviewFormValues) => Promise<ReviewSubmitResult>;
  review: EditableReview;
};

const getInitialValues = (review: EditableReview): ReviewFormValues => ({
  rating: review.rating,
  text: review.text,
  title: review.title,
});

export const useReviewEditForm = ({
  isSubmitting,
  onCancel,
  onSubmit,
  review,
}: UseReviewEditFormOptions) => {
  const [values, setValues] = useState<ReviewFormValues>(
    getInitialValues(review),
  );
  const [fieldErrors, setFieldErrors] = useState<ReviewFormErrors>({});
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setValues(getInitialValues(review));
    setFieldErrors({});
    setError(null);
  }, [review]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const updateField = <Field extends keyof ReviewFormValues>(
    field: Field,
    value: ReviewFormValues[Field],
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

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setFieldErrors({});

    const validationResult = reviewSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(getReviewFieldErrors(validationResult.error));
      return;
    }

    try {
      const response = await onSubmit(validationResult.data);

      if (!response.success) {
        setError(response.message ?? 'Failed to update review');
        return;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update review',
      );
    }
  };

  return {
    error,
    fieldErrors,
    handleCancel,
    handleSubmit,
    updateField,
    values,
  };
};
