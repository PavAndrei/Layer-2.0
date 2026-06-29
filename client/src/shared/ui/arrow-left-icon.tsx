import type { SVGProps } from 'react';

type ArrowLeftIconProps = SVGProps<SVGSVGElement>;

export const ArrowLeftIcon = ({
  'aria-hidden': ariaHidden = true,
  ...props
}: ArrowLeftIconProps) => {
  return (
    <svg
      {...props}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L8 12L15 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
};
