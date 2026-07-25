type AdminUserFilterChipProps = {
  userId: string;
  onClear: () => void;
};

const getShortUserId = (userId: string) => {
  if (userId.length <= 12) return userId;

  return `${userId.slice(0, 6)}...${userId.slice(-4)}`;
};

export const AdminUserFilterChip = ({
  onClear,
  userId,
}: AdminUserFilterChipProps) => (
  <div className="flex flex-wrap items-center gap-2 rounded border border-border-soft bg-background-surface p-3">
    <span className="block-small text-typography-secondary">
      Filtered by user
    </span>
    <code className="rounded border border-border-soft bg-background-secondary px-2 py-1 block-small text-typography-primary">
      {getShortUserId(userId)}
    </code>
    <button
      className="inline-flex min-h-8 items-center rounded border border-border-strong bg-background-surface px-3 py-1 block-small text-typography-primary transition-colors hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
      type="button"
      onClick={onClear}
    >
      Clear
    </button>
  </div>
);
