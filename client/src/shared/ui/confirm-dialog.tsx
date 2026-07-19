import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

import { Button } from './button';

type ConfirmDialogTone = 'neutral' | 'danger';

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  description?: ReactNode;
  isConfirming?: boolean;
  isOpen: boolean;
  title: string;
  tone?: ConfirmDialogTone;
  onCancel: () => void;
  onConfirm: () => void;
};

const toneClasses: Record<
  ConfirmDialogTone,
  { marker: string }
> = {
  neutral: {
    marker: 'bg-accent-primary',
  },
  danger: {
    marker: 'bg-accent-secondary',
  },
};

export const ConfirmDialog = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmingLabel = 'Working...',
  description,
  isConfirming = false,
  isOpen,
  onCancel,
  onConfirm,
  title,
  tone = 'neutral',
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isConfirming) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [isConfirming, isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-accent-black/40 px-3 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isConfirming) {
          onCancel();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded border border-border-strong bg-background-surface shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-8 w-1 shrink-0 rounded-full ${toneClasses[tone].marker}`}
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h2
                id={titleId}
                className="block-title text-typography-heading"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descriptionId}
                  className="block-small text-typography-secondary"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              ref={cancelButtonRef}
              className="w-full sm:w-fit"
              disabled={isConfirming}
              variant="secondary"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              className="w-full sm:w-fit"
              disabled={isConfirming}
              variant={tone === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
            >
              {isConfirming ? confirmingLabel : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
