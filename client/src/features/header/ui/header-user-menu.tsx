import { Link } from 'react-router';

import type { HeaderUser } from '../model';
import { useHeaderUserMenu } from '../model';
import { UserIcon } from './header-icons';

type HeaderUserMenuProps = {
  isLogoutPending: boolean;
  triggerClassName?: string;
  user: HeaderUser;
  onLogout: () => void;
};

export const HeaderUserMenu = ({
  isLogoutPending,
  triggerClassName = '',
  user,
  onLogout,
}: HeaderUserMenuProps) => {
  const {
    closeUserMenu,
    isUserMenuOpen,
    toggleUserMenu,
    userMenuRef,
  } = useHeaderUserMenu();

  const handleLogout = () => {
    onLogout();
    closeUserMenu();
  };

  return (
    <div className="relative inline-flex h-6 w-6 items-center justify-center" ref={userMenuRef}>
      <button
        type="button"
        className={triggerClassName}
        aria-label="Open account menu"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="menu"
        onClick={toggleUserMenu}
      >
        <UserIcon size={24} />
      </button>

      {isUserMenuOpen && (
        <div
          role="menu"
          className="fixed right-2 top-22 z-30 w-[calc(100vw-1rem)] max-w-64 border border-border-strong bg-background-surface shadow-lg min-[400px]:absolute min-[400px]:right-0 min-[400px]:top-full min-[400px]:mt-3 min-[400px]:w-64"
        >
          <div className="border-b border-border-strong px-4 py-3">
            <p className="block-medium text-typography-heading">{user.name}</p>
            <p className="block-small break-all text-typography-secondary">
              {user.email}
            </p>
          </div>

          <Link
            to="/profile"
            role="menuitem"
            className="block w-full border-b border-border-strong px-4 py-3 text-left block-medium text-typography-heading transition-colors hover:bg-background-secondary hover:text-accent-hover"
            onClick={closeUserMenu}
          >
            Profile
          </Link>

          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-3 text-left block-medium text-typography-heading transition-colors hover:bg-background-secondary hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLogoutPending}
            onClick={handleLogout}
          >
            {isLogoutPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
};
