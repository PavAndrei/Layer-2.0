import type { FormEvent } from 'react';

import { ReviewForm } from '../../../entities/review';
import type {
  ProductReviewFormErrors,
  ProductReviewFormValues,
} from '../model';

type ProductReviewFormProps = {
  error: string | null;
  fieldErrors: ProductReviewFormErrors;
  isCreated: boolean;
  isSubmitting: boolean;
  values: ProductReviewFormValues;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateField: <Field extends keyof ProductReviewFormValues>(
    field: Field,
    value: ProductReviewFormValues[Field],
  ) => void;
};

export const ProductReviewForm = ({
  error,
  fieldErrors,
  isCreated,
  isSubmitting,
  onSubmit,
  onUpdateField,
  values,
}: ProductReviewFormProps) => (
  <ReviewForm
    description="Share your fit, quality, and comfort notes for this item."
    errorMessage={
      error
        ? {
            title: 'Could not submit review',
            description: error,
          }
        : null
    }
    fieldErrors={fieldErrors}
    idPrefix="product-review"
    isDisabled={isCreated}
    isSubmitting={isSubmitting}
    submitLabel="Submit review"
    submittingLabel="Submitting..."
    successMessage={
      isCreated
        ? {
            title: 'Review submitted',
            description: 'Thanks for sharing your feedback.',
          }
        : null
    }
    title="Write a review"
    values={values}
    onSubmit={onSubmit}
    onUpdateField={onUpdateField}
  />
);
