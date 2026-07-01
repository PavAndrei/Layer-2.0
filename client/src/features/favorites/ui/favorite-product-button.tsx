import type { Product } from '../../../entities/product';

type FavoriteProductButtonProps = {
  isFavorite: boolean;
  isPending?: boolean;
  product: Product;
  onToggle: (product: Product) => void;
};

export const FavoriteProductButton = ({
  isFavorite,
  isPending = false,
  product,
  onToggle,
}: FavoriteProductButtonProps) => {
  return (
    <button
      type="button"
      aria-label={
        isFavorite ? 'Remove from favorites' : 'Add to favorites'
      }
      aria-pressed={isFavorite}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded border border-border-strong bg-background-surface text-accent-secondary shadow-sm transition-colors hover:border-border-active hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => onToggle(product)}
    >
      <svg
        aria-hidden="true"
        className="size-5"
        fill={isFavorite ? 'currentColor' : 'none'}
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
    </button>
  );
};
