import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type MobileFullscreenDrawerProps = {
  children: ReactNode;
  closeLabel?: string;
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
};

const ANIMATION_DURATION_MS = 300;

export const MobileFullscreenDrawer = ({
  children,
  closeLabel = 'Close',
  isOpen,
  onClose,
  title,
}: MobileFullscreenDrawerProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    let animationFrameId: number | null = null;
    let visibilityFrameId: number | null = null;
    let timeoutId: number | null = null;

    if (isOpen) {
      setShouldRender(true);
      animationFrameId = window.requestAnimationFrame(() => {
        visibilityFrameId = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      return () => {
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
        }

        if (visibilityFrameId !== null) {
          window.cancelAnimationFrame(visibilityFrameId);
        }
      };
    }

    setIsVisible(false);
    timeoutId = window.setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION_MS);

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !shouldRender) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 bg-background-surface transition-[opacity,transform] duration-300 ease-out md:hidden ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-4 py-4">
          <h2 id={titleId} className="block-title text-typography-heading">
            {title}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-border-soft bg-background-primary text-2xl leading-none text-typography-primary transition-colors hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black"
          >
            x
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
