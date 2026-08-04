import { useEffect, useRef } from 'react';
import type { FormEvent } from 'react';

import { Button } from '../../../shared/ui';

const COMMENT_TEXT_MAX_LENGTH = 2000;
const COMMENT_TEXTAREA_MAX_HEIGHT = 220;

type BlogPostCommentFormProps = {
  ariaLabel?: string;
  cancelLabel?: string;
  error?: string | null;
  id: string;
  isSubmitting: boolean;
  placeholder?: string;
  submitLabel: string;
  submittingLabel: string;
  value: string;
  onCancel?: () => void;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const BlogPostCommentForm = ({
  ariaLabel = 'Comment text',
  cancelLabel = 'Cancel',
  error,
  id,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  placeholder = 'Share your thoughts',
  submitLabel,
  submittingLabel,
  value,
}: BlogPostCommentFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSubmitDisabled = isSubmitting || value.trim().length === 0;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';

    const nextHeight = Math.min(
      textarea.scrollHeight,
      COMMENT_TEXTAREA_MAX_HEIGHT,
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > COMMENT_TEXTAREA_MAX_HEIGHT
        ? 'auto'
        : 'hidden';
  }, [value]);

  return (
    <form className="flex flex-col gap-2" noValidate onSubmit={onSubmit}>
      <textarea
        ref={textareaRef}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={error ? `${errorId} ${counterId}` : counterId}
        aria-invalid={Boolean(error)}
        className={`min-h-24 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-red-600' : 'border-border-strong'
        }`}
        disabled={isSubmitting}
        maxLength={COMMENT_TEXT_MAX_LENGTH}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        {error ? (
          <p id={errorId} className="block-small text-red-600">
            {error}
          </p>
        ) : (
          <span />
        )}
        <p
          id={counterId}
          className={`block-small ${
            value.length >= COMMENT_TEXT_MAX_LENGTH
              ? 'text-accent-primary'
              : 'text-typography-muted'
          }`}
        >
          {value.length}/{COMMENT_TEXT_MAX_LENGTH}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            className="w-full sm:w-fit"
            disabled={isSubmitting}
            size="sm"
            variant="secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitDisabled}
          size="sm"
          type="submit"
          variant="primary"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};
