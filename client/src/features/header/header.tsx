import { Link, useLocation } from 'react-router';

import type { HeaderAuthStatus, HeaderUser } from './model';
import { useHeaderMobileMenu } from './model';
import {
  HeaderActions,
  HeaderLogo,
  HeaderMobileMenu,
  HeaderNav,
} from './ui';

type HeaderProps = {
  authStatus: HeaderAuthStatus;
  cartItemsCount: number;
  isLogoutPending: boolean;
  user: HeaderUser | null;
  onLogout: () => void;
};

export const Header = ({
  authStatus,
  cartItemsCount,
  isLogoutPending,
  user,
  onLogout,
}: HeaderProps) => {
  const { pathname } = useLocation();
  const { closeMobileMenu, isMobileMenuOpen, openMobileMenu } =
    useHeaderMobileMenu();

  return (
    <header className="py-8 border-b border-border-strong">
      <div className="container mx-auto">
        <div className="flex justify-between items-center flex-wrap">
          <Link to="/" className="order-1 w-30 min-[350px]:w-auto">
            <HeaderLogo />
          </Link>
          <HeaderNav pathname={pathname} />
          <HeaderActions
            authStatus={authStatus}
            cartItemsCount={cartItemsCount}
            isMobileMenuOpen={isMobileMenuOpen}
            isLogoutPending={isLogoutPending}
            user={user}
            onMobileMenuOpen={openMobileMenu}
            onLogout={onLogout}
          />
        </div>
      </div>
      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        pathname={pathname}
      />
    </header>
  );
};
