import { Link } from 'react-router';

import type { HeaderAuthStatus, HeaderUser } from '../model';
import {
  BurgerMenuIcon,
  UserIcon,
} from './header-icons';
import { HeaderCartButton } from './header-cart-button';
import { HeaderFavoriteButton } from './header-favorite-button';
import { HeaderUserMenu } from './header-user-menu';

type HeaderActionsProps = {
  authStatus: HeaderAuthStatus;
  cartItemsCount: number;
  favoriteItemsCount: number;
  isMobileMenuOpen: boolean;
  isLogoutPending: boolean;
  user: HeaderUser | null;
  onMobileMenuOpen: () => void;
  onLogout: () => void;
};

const ICON_BUTTON_CLASS_NAME =
  'inline-flex h-6 w-6 items-center justify-center leading-none transition-colors hover:text-accent-hover cursor-pointer';

export const HeaderActions = ({
  authStatus,
  cartItemsCount,
  favoriteItemsCount,
  isMobileMenuOpen,
  isLogoutPending,
  user,
  onMobileMenuOpen,
  onLogout,
}: HeaderActionsProps) => {
  const isAuthenticated = authStatus === 'authenticated' && user;
  const isAuthLoading = authStatus === 'idle' || authStatus === 'loading';

  return (
    <div className="flex items-center gap-5 text-typography-heading order-3 sm:order-2 lg:order-3">
      {isAuthenticated ? (
        <HeaderUserMenu
          user={user}
          isLogoutPending={isLogoutPending}
          triggerClassName={ICON_BUTTON_CLASS_NAME}
          onLogout={onLogout}
        />
      ) : (
        <Link
          to="/login"
          className={`${ICON_BUTTON_CLASS_NAME} ${
            isAuthLoading ? 'pointer-events-none opacity-50' : ''
          }`}
          aria-disabled={isAuthLoading}
          aria-label={isAuthLoading ? 'Loading account' : 'Sign in'}
        >
          <UserIcon size={24} />
        </Link>
      )}

      <HeaderFavoriteButton
        isAuthenticated={Boolean(isAuthenticated)}
        itemsCount={favoriteItemsCount}
        className={ICON_BUTTON_CLASS_NAME}
      />

      <HeaderCartButton
        itemsCount={cartItemsCount}
        className={ICON_BUTTON_CLASS_NAME}
      />

      <button
        type="button"
        className={`${ICON_BUTTON_CLASS_NAME} block sm:hidden`}
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
        onClick={onMobileMenuOpen}
      >
        <BurgerMenuIcon size={24} />
      </button>
    </div>
  );
};
