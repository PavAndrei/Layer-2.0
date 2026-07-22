import { Button } from '../../../shared/ui';

type AdminUserNoteCardProps = {
  isSubmitting?: boolean;
  value: string;
  onSubmit: () => void;
  onValueChange: (value: string) => void;
};

const ADMIN_USER_NOTE_MAX_LENGTH = 500;

export const AdminUserNoteCard = ({
  isSubmitting = false,
  onSubmit,
  onValueChange,
  value,
}: AdminUserNoteCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h2 className="block-title text-typography-heading">Admin note</h2>
      <p className="block-small text-typography-secondary">
        Store a short internal note about this customer.
      </p>
    </div>

    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <textarea
        className="min-h-28 w-full resize-none rounded border border-border-strong bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        maxLength={ADMIN_USER_NOTE_MAX_LENGTH}
        placeholder="Customer contacted support about duplicated payment."
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="block-small text-typography-muted">
          {value.length}/{ADMIN_USER_NOTE_MAX_LENGTH}
        </span>

        <Button
          className="w-full sm:w-fit"
          disabled={isSubmitting}
          size="sm"
          type="submit"
          variant="primary"
        >
          {isSubmitting ? 'Saving...' : 'Save note'}
        </Button>
      </div>
    </form>
  </section>
);
