import { useEffect, useRef, useState } from 'react';

import type { ReviewFormValues } from '../../../entities/review';
import {
  Button,
  FeedbackMessage,
  StarIcon,
  TextInput,
} from '../../../shared/ui';
import {
  type EditableReview,
  useReviewEditForm,
} from '../model';

type ReviewEditFormProps = {
  isSubmitting: boolean;
  review: EditableReview;
  onCancel: () => void;
  onSubmit: (review: ReviewFormValues) => Promise<{
    message?: string;
    success: boolean;
  }>;
};

const ratingOptions = [1, 2, 3, 4, 5] as const;
const REVIEW_TEXTAREA_MAX_HEIGHT = 220;

export const ReviewEditForm = ({
  isSubmitting,
  onCancel,
  onSubmit,
  review,
}: ReviewEditFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const form = useReviewEditForm({
    isSubmitting,
    onCancel,
    onSubmit,
    review,
  });
  const previewRating = hoveredRating ?? form.values.rating;

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
  }, [form.values.text]);

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      noValidate
      onSubmit={form.handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <h3 className="block-title text-typography-heading">
          Edit review
        </h3>
        <p className="block-small text-typography-secondary">
          Update your rating, title, or product feedback.
        </p>
      </div>

      {form.error && (
        <FeedbackMessage
          tone="danger"
          title="Could not update review"
          description={form.error}
        />
      )}

      <div className="flex flex-col gap-2">
        <span className="block-medium text-typography-heading">Rating</span>
        <div
          className="flex items-center gap-1"
          role="radiogroup"
          aria-label="Review rating"
          onMouseLeave={() => setHoveredRating(null)}
        >
          {ratingOptions.map((rating) => {
            const isSelected = form.values.rating === rating;
            const isFilled = rating <= previewRating;

            return (
              <button
                key={rating}
                type="button"
                className={`flex size-10 cursor-pointer items-center justify-center rounded border bg-background-surface transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 ${
                  isSelected
                    ? 'border-accent-primary'
                    : 'border-border-strong hover:border-accent-primary hover:bg-background-secondary'
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                disabled={isSubmitting}
                onClick={() => form.updateField('rating', rating)}
                onFocus={() => setHoveredRating(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
              >
                <StarIcon
                  className="size-5.5 transition-colors"
                  fillPercent={isFilled ? 100 : 0}
                />
              </button>
            );
          })}
        </div>
        {form.fieldErrors.rating && (
          <p className="block-small text-red-600">
            {form.fieldErrors.rating}
          </p>
        )}
      </div>

      <TextInput
        required
        id={`review-edit-title-${review._id}`}
        label="Title"
        placeholder="Great heavyweight feel"
        error={form.fieldErrors.title}
        disabled={isSubmitting}
        value={form.values.title}
        onChange={(value) => form.updateField('title', value)}
      />

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor={`review-edit-text-${review._id}`}
        >
          Review
        </label>
        <textarea
          required
          id={`review-edit-text-${review._id}`}
          ref={textareaRef}
          className={`min-h-28 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            form.fieldErrors.text ? 'border-red-600' : 'border-border-strong'
          }`}
          aria-describedby={
            form.fieldErrors.text
              ? `review-edit-text-error-${review._id}`
              : undefined
          }
          aria-invalid={Boolean(form.fieldErrors.text)}
          disabled={isSubmitting}
          maxLength={2000}
          placeholder="Tell other customers what stood out."
          value={form.values.text}
          onChange={(event) =>
            form.updateField('text', event.target.value)
          }
        />
        {form.fieldErrors.text && (
          <p
            id={`review-edit-text-error-${review._id}`}
            className="block-small text-red-600"
          >
            {form.fieldErrors.text}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitting}
          variant="secondary"
          onClick={form.handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};
