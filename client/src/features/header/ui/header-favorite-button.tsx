import { Link } from 'react-router';

import { formatHeaderItemsCount } from '../helpers';
import { FavoriteIcon } from './header-icons';

type HeaderFavoriteButtonProps = {
  className?: string;
  isAuthenticated: boolean;
  itemsCount: number;
};

export const HeaderFavoriteButton = ({
  className = '',
  isAuthenticated,
  itemsCount,
}: HeaderFavoriteButtonProps) => {
  const hasItems = itemsCount > 0;

  return (
    <Link
      to={isAuthenticated ? '/favorites' : '/login'}
      className={`relative ${className}`}
      aria-label={
        isAuthenticated
          ? hasItems
            ? `Favorites, ${itemsCount} items`
            : 'Favorites'
          : 'Sign in to view favorites'
      }
    >
      <FavoriteIcon size={24} />

      {isAuthenticated && hasItems && (
        <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 animate-pulse items-center justify-center rounded-full border border-background-surface bg-accent-primary px-1 text-[10px] font-semibold leading-none text-background-surface">
          {formatHeaderItemsCount(itemsCount)}
        </span>
      )}
    </Link>
  );
};
