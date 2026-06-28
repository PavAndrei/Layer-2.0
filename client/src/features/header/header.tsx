import { Link, useLocation } from 'react-router';
import { HeaderLogo } from './header-logo';
import { CartIcon, FavoriteIcon, UserIcon } from './header-icons';
import {
  HEADER_NAVIGATION_ITEMS,
  isHeaderNavigationItemActive,
} from './header-navigation';

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="py-8 border-b border-border-strong">
      <div className="container mx-auto px-2.5">
        <div className="flex justify-between items-center">
          <Link to="/">
            <HeaderLogo />
          </Link>
          <nav>
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
          <div className="flex items-center gap-5 text-typography-heading">
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
          </div>
        </div>
      </div>
    </header>
  );
};
