import type { ReactNode } from 'react';

type FeedbackMessageTone = 'neutral' | 'danger';

type FeedbackMessageProps = {
  action?: ReactNode;
  description?: ReactNode;
  title: string;
  tone?: FeedbackMessageTone;
};

const toneClasses: Record<FeedbackMessageTone, string> = {
  neutral: 'border-border-soft bg-background-surface',
  danger: 'border-accent-secondary/35 bg-background-surface',
};

export const FeedbackMessage = ({
  action,
  description,
  title,
  tone = 'neutral',
}: FeedbackMessageProps) => {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded border p-4 ${toneClasses[tone]}`}
    >
      <div className="flex flex-col gap-1">
        <h2 className="block-title text-typography-heading">{title}</h2>
        {description && (
          <p className="block-small text-typography-secondary">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
};
