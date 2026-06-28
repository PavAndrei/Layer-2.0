import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { MobileFullscreenDrawer } from '../../shared/ui';
import { HeaderLogo } from './header-logo';
import {
  BurgerMenuIcon,
  CartIcon,
  FavoriteIcon,
  UserIcon,
} from './header-icons';
import {
  HEADER_NAVIGATION_ITEMS,
  isHeaderNavigationItemActive,
} from './header-navigation';

export const Header = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openMobileMenu = () => setIsMobileMenuOpen(true);

  return (
    <header className="py-8 border-b border-border-strong">
      <div className="container mx-auto">
        <div className="flex justify-between items-center flex-wrap">
          <Link to="/" className="order-1 w-30 min-[350px]:w-auto">
            <HeaderLogo />
          </Link>
          <nav className="hidden sm:block sm:w-full sm:pt-8 sm:order-3 lg:pt-0 lg:order-2 lg:w-auto">
            <ul className="flex items-center gap-5">
              {HEADER_NAVIGATION_ITEMS.map((item) => {
                const isActive = isHeaderNavigationItemActive(
                  item.path,
                  pathname,
                );

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block-title relative text-typography-heading transition-colors hover:text-accent-hover after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-accent-primary after:transition-[width] after:duration-200 ${
                        isActive ? 'after:w-full' : 'after:w-0'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-5 text-typography-heading order-3 sm:order-2 lg:order-3">
            <button
              className="transition-colors hover:text-accent-hover cursor-pointer"
              aria-label="User profile"
            >
              <UserIcon size={24} />
            </button>

            <button
              className="transition-colors hover:text-accent-hover cursor-pointer"
              aria-label="Favorites"
            >
              <FavoriteIcon size={24} />
            </button>

            <button
              className="transition-colors hover:text-accent-hover cursor-pointer"
              aria-label="Cart"
            >
              <CartIcon size={24} />
            </button>
            <button
              className="transition-colors hover:text-accent-hover cursor-pointer block sm:hidden"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              onClick={openMobileMenu}
            >
              <BurgerMenuIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      <MobileFullscreenDrawer
        title="Menu"
        closeLabel="Close menu"
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      >
        <nav>
          <ul className="flex flex-col gap-4">
            {HEADER_NAVIGATION_ITEMS.map((item) => {
              const isActive = isHeaderNavigationItemActive(
                item.path,
                pathname,
              );

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMobileMenu}
                    className={`section-title relative inline-flex text-typography-heading transition-colors hover:text-accent-hover after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-accent-primary after:transition-[width] after:duration-200 ${
                      isActive ? 'after:w-full' : 'after:w-0'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </MobileFullscreenDrawer>
    </header>
  );
};
