import { Link, useLocation } from 'react-router';

import { useHeaderMobileMenu } from './model';
import {
  HeaderActions,
  HeaderLogo,
  HeaderMobileMenu,
  HeaderNav,
} from './ui';

type HeaderProps = {
  cartItemsCount: number;
};

export const Header = ({ cartItemsCount }: HeaderProps) => {
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
            cartItemsCount={cartItemsCount}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuOpen={openMobileMenu}
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
