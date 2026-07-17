import { useEffect, useRef } from 'react';
import type { FormEvent } from 'react';

import { Button, FeedbackMessage, TextInput } from '../../../shared/ui';
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

const ratingOptions = [1, 2, 3, 4, 5] as const;
const REVIEW_TEXTAREA_MAX_HEIGHT = 220;

export const ProductReviewForm = ({
  error,
  fieldErrors,
  isCreated,
  isSubmitting,
  onSubmit,
  onUpdateField,
  values,
}: ProductReviewFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';

    const nextHeight = Math.min(
      textarea.scrollHeight,
      REVIEW_TEXTAREA_MAX_HEIGHT,
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > REVIEW_TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
  }, [values.text]);

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1">
        <h3 className="block-title text-typography-heading">
          Write a review
        </h3>
        <p className="block-small text-typography-secondary">
          Share your fit, quality, and comfort notes for this item.
        </p>
      </div>

      {isCreated && (
        <FeedbackMessage
          title="Review submitted"
          description="Thanks for sharing your feedback."
        />
      )}

      {error && (
        <FeedbackMessage
          tone="danger"
          title="Could not submit review"
          description={error}
        />
      )}

      <div className="flex flex-col gap-2">
        <span className="block-medium text-typography-heading">Rating</span>
        <div
          className="grid grid-cols-5 gap-2"
          role="radiogroup"
          aria-label="Review rating"
        >
          {ratingOptions.map((rating) => {
            const isSelected = values.rating === rating;

            return (
              <button
                key={rating}
                type="button"
                className={`min-h-10 rounded border block-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black disabled:cursor-not-allowed disabled:opacity-45 ${
                  isSelected
                    ? 'border-accent-primary bg-accent-primary text-background-surface'
                    : 'border-border-strong bg-background-surface text-typography-primary hover:bg-background-secondary'
                }`}
                role="radio"
                aria-checked={isSelected}
                disabled={isSubmitting || isCreated}
                onClick={() => onUpdateField('rating', rating)}
              >
                {rating}
              </button>
            );
          })}
        </div>
        {fieldErrors.rating && (
          <p className="block-small text-red-600">{fieldErrors.rating}</p>
        )}
      </div>

      <TextInput
        required
        id="product-review-title"
        label="Title"
        placeholder="Great heavyweight feel"
        error={fieldErrors.title}
        disabled={isSubmitting || isCreated}
        value={values.title}
        onChange={(value) => onUpdateField('title', value)}
      />

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor="product-review-text"
        >
          Review
        </label>
        <textarea
          required
          id="product-review-text"
          ref={textareaRef}
          className={`min-h-28 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            fieldErrors.text ? 'border-red-600' : 'border-border-strong'
          }`}
          aria-describedby={
            fieldErrors.text ? 'product-review-text-error' : undefined
          }
          aria-invalid={Boolean(fieldErrors.text)}
          disabled={isSubmitting || isCreated}
          maxLength={2000}
          placeholder="Tell other customers what stood out."
          value={values.text}
          onChange={(event) => onUpdateField('text', event.target.value)}
        />
        {fieldErrors.text && (
          <p
            id="product-review-text-error"
            className="block-small text-red-600"
          >
            {fieldErrors.text}
          </p>
        )}
      </div>

      <Button
        className="w-full sm:w-fit"
        disabled={isSubmitting || isCreated}
        type="submit"
        variant="primary"
      >
        {isSubmitting ? 'Submitting...' : 'Submit review'}
      </Button>
    </form>
  );
};
