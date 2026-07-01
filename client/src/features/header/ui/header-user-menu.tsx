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
    <div className="relative" ref={userMenuRef}>
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
          className="absolute right-0 top-full z-30 mt-3 w-64 border border-border-strong bg-background-surface shadow-lg"
        >
          <div className="border-b border-border-strong px-4 py-3">
            <p className="block-medium text-typography-heading">{user.name}</p>
            <p className="block-small break-all text-typography-secondary">
              {user.email}
            </p>
          </div>

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
