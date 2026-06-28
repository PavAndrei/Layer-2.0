import type { SVGProps } from 'react';

type HeaderIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  iconColor?: string;
  accentColor?: string;
};

const DEFAULT_ICON_COLOR = 'currentColor';
const DEFAULT_ACCENT_COLOR = '#4B5320';

export const UserIcon = ({
  size = 24,
  iconColor = DEFAULT_ICON_COLOR,
  accentColor = DEFAULT_ACCENT_COLOR,
  strokeWidth = 3.8,
  ...props
}: HeaderIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="24"
        cy="16"
        r="7"
        stroke={iconColor}
        strokeWidth={strokeWidth}
      />

      <path
        d="M11 39V34C11 27.925 15.925 23 22 23H26C32.075 23 37 27.925 37 34V39"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 42H30"
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const FavoriteIcon = ({
  size = 24,
  iconColor = DEFAULT_ICON_COLOR,
  accentColor = DEFAULT_ACCENT_COLOR,
  strokeWidth = 3.8,
  ...props
}: HeaderIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M24 39.5L11.8 27.3C8.4 23.9 8.4 18.4 11.8 15C15.2 11.6 20.7 11.6 24 15C27.3 11.6 32.8 11.6 36.2 15C39.6 18.4 39.6 23.9 36.2 27.3L24 39.5Z"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M20.5 36L24 39.5L27.5 36"
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CartIcon = ({
  size = 24,
  iconColor = DEFAULT_ICON_COLOR,
  accentColor = DEFAULT_ACCENT_COLOR,
  strokeWidth = 3.8,
  ...props
}: HeaderIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13 18H35C37.761 18 40 20.239 40 23V36C40 38.761 37.761 41 35 41H13C10.239 41 8 38.761 8 36V23C8 20.239 10.239 18 13 18Z"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 18V15C17 11.134 20.134 8 24 8C27.866 8 31 11.134 31 15V18"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 27H30"
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const BurgerMenuIcon = ({
  size = 24,
  iconColor = DEFAULT_ICON_COLOR,
  accentColor = DEFAULT_ACCENT_COLOR,
  strokeWidth = 3.8,
  ...props
}: HeaderIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 15H38"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M10 24H38"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M10 33H38"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M30 24H38"
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
