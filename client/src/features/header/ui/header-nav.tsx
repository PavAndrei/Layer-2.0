import { Link } from 'react-router';
import {
  HEADER_NAVIGATION_ITEMS,
  isHeaderNavigationItemActive,
} from '../model';

type HeaderNavProps = {
  pathname: string;
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

const NAV_CLASS_NAMES = {
  desktop:
    'hidden sm:block sm:w-full sm:pt-8 sm:pl-2.5 sm:order-3 lg:pt-0 lg:pl-0 lg:order-2 lg:w-auto',
  mobile: '',
} as const;

const LIST_CLASS_NAMES = {
  desktop: 'flex items-center gap-5',
  mobile: 'flex flex-col gap-4',
} as const;

const LINK_CLASS_NAMES = {
  desktop: 'block-title',
  mobile: 'section-title inline-flex',
} as const;

export const HeaderNav = ({
  pathname,
  variant = 'desktop',
  onNavigate,
}: HeaderNavProps) => {
  return (
    <nav
      aria-label={variant === 'desktop' ? 'Main navigation' : 'Mobile menu'}
      className={NAV_CLASS_NAMES[variant]}
    >
      <ul className={LIST_CLASS_NAMES[variant]}>
        {HEADER_NAVIGATION_ITEMS.map((item) => {
          const isActive = isHeaderNavigationItemActive(item.path, pathname);

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                onClick={onNavigate}
                className={`${LINK_CLASS_NAMES[variant]} relative text-typography-heading transition-colors hover:text-accent-hover after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-accent-primary after:transition-[width] after:duration-200 ${
                  isActive ? 'after:w-full pointer-events-none' : 'after:w-0'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
