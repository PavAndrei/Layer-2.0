import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import {
  Button,
  FeedbackMessage,
  StarIcon,
  TextInput,
} from '../../../shared/ui';
import {
  REVIEW_TEXT_MAX_LENGTH,
  type ReviewFormErrors,
  type ReviewFormValues,
} from '../model';

type ReviewFormMessage = {
  description: string;
  title: string;
};

type ReviewFormProps = {
  cancelLabel?: string;
  description: string;
  errorMessage?: ReviewFormMessage | null;
  fieldErrors: ReviewFormErrors;
  idPrefix: string;
  isDisabled?: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  successMessage?: ReviewFormMessage | null;
  title: string;
  values: ReviewFormValues;
  onCancel?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateField: <Field extends keyof ReviewFormValues>(
    field: Field,
    value: ReviewFormValues[Field],
  ) => void;
};

const ratingOptions = [1, 2, 3, 4, 5] as const;
const REVIEW_TEXTAREA_MAX_HEIGHT = 220;

export const ReviewForm = ({
  cancelLabel = 'Cancel',
  description,
  errorMessage,
  fieldErrors,
  idPrefix,
  isDisabled = false,
  isSubmitting,
  onCancel,
  onSubmit,
  onUpdateField,
  submitLabel,
  submittingLabel,
  successMessage,
  title,
  values,
}: ReviewFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const previewRating = hoveredRating ?? values.rating;
  const formDisabled = isSubmitting || isDisabled;
  const titleInputId = `${idPrefix}-title`;
  const textInputId = `${idPrefix}-text`;
  const textErrorId = `${idPrefix}-text-error`;
  const textCounterId = `${idPrefix}-text-counter`;
  const actions: ReactNode = onCancel ? (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button
        className="w-full sm:w-fit"
        disabled={isSubmitting}
        variant="secondary"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        className="w-full sm:w-fit"
        disabled={formDisabled}
        type="submit"
        variant="primary"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full sm:w-fit"
      disabled={formDisabled}
      type="submit"
      variant="primary"
    >
      {isSubmitting ? submittingLabel : submitLabel}
    </Button>
  );

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
        <h3 className="block-title text-typography-heading">{title}</h3>
        <p className="block-small text-typography-secondary">
          {description}
        </p>
      </div>

      {successMessage && (
        <FeedbackMessage
          title={successMessage.title}
          description={successMessage.description}
        />
      )}

      {errorMessage && (
        <FeedbackMessage
          tone="danger"
          title={errorMessage.title}
          description={errorMessage.description}
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
            const isSelected = values.rating === rating;
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
                disabled={formDisabled}
                onClick={() => onUpdateField('rating', rating)}
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
        {fieldErrors.rating && (
          <p className="block-small text-red-600">{fieldErrors.rating}</p>
        )}
      </div>

      <TextInput
        required
        id={titleInputId}
        label="Title"
        placeholder="Great heavyweight feel"
        error={fieldErrors.title}
        disabled={formDisabled}
        value={values.title}
        onChange={(value) => onUpdateField('title', value)}
      />

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor={textInputId}
        >
          Review
        </label>
        <textarea
          required
          id={textInputId}
          ref={textareaRef}
          className={`min-h-28 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            fieldErrors.text ? 'border-red-600' : 'border-border-strong'
          }`}
          aria-describedby={
            fieldErrors.text
              ? `${textErrorId} ${textCounterId}`
              : textCounterId
          }
          aria-invalid={Boolean(fieldErrors.text)}
          disabled={formDisabled}
          maxLength={REVIEW_TEXT_MAX_LENGTH}
          placeholder="Tell other customers what stood out."
          value={values.text}
          onChange={(event) => onUpdateField('text', event.target.value)}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          {fieldErrors.text ? (
            <p id={textErrorId} className="block-small text-red-600">
              {fieldErrors.text}
            </p>
          ) : (
            <span />
          )}
          <p
            id={textCounterId}
            className={`block-small ${
              values.text.length >= REVIEW_TEXT_MAX_LENGTH
                ? 'text-accent-primary'
                : 'text-typography-muted'
            }`}
          >
            {values.text.length}/{REVIEW_TEXT_MAX_LENGTH}
          </p>
        </div>
      </div>

      {actions}
    </form>
  );
};
