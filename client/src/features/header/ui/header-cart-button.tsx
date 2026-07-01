import { Link } from 'react-router';

import { CartIcon } from './header-icons';

type HeaderCartButtonProps = {
  itemsCount: number;
  className?: string;
};

const formatCartItemsCount = (itemsCount: number) => {
  if (itemsCount > 99) return '99+';

  return String(itemsCount);
};

export const HeaderCartButton = ({
  itemsCount,
  className = '',
}: HeaderCartButtonProps) => {
  const hasItems = itemsCount > 0;

  return (
    <Link
      to="/cart"
      className={`relative ${className}`}
      aria-label={hasItems ? `Cart, ${itemsCount} items` : 'Cart'}
    >
      <CartIcon size={24} />

      {hasItems && (
        <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 animate-pulse items-center justify-center rounded-full border border-background-surface bg-accent-primary px-1 text-[10px] font-semibold leading-none text-background-surface">
          {formatCartItemsCount(itemsCount)}
        </span>
      )}
    </Link>
  );
};
