type BlogPostLikeButtonProps = {
  error?: string | null;
  isLiked: boolean;
  isPending?: boolean;
  likesCount: number;
  onToggle: () => void;
};

export const BlogPostLikeButton = ({
  error,
  isLiked,
  isPending = false,
  likesCount,
  onToggle,
}: BlogPostLikeButtonProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <button
        type="button"
        aria-label={isLiked ? 'Remove article like' : 'Like article'}
        aria-pressed={isLiked}
        className={[
          'inline-flex min-h-8 w-fit cursor-pointer items-center gap-2 rounded border px-3 py-1.5 block-small transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
          isLiked
            ? 'border-accent-primary bg-accent-primary text-background-surface hover:border-accent-hover hover:bg-accent-hover'
            : 'border-border-strong bg-background-surface text-typography-secondary hover:border-border-active hover:text-accent-hover',
        ].join(' ')}
        disabled={isPending}
        title={isLiked ? 'Remove article like' : 'Like article'}
        onClick={onToggle}
      >
        <svg
          aria-hidden="true"
          className="size-4 shrink-0"
          fill={isLiked ? 'currentColor' : 'none'}
          focusable="false"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 20.25L5.2 13.68C3.31 11.86 3.31 8.88 5.2 7.06C7.08 5.24 10.14 5.24 12 7.06C13.86 5.24 16.92 5.24 18.8 7.06C20.69 8.88 20.69 11.86 18.8 13.68L12 20.25Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        <span>{likesCount}</span>
      </button>

      {error && (
        <p className="max-w-60 block-small text-accent-secondary">
          {error}
        </p>
      )}
    </div>
  );
};
