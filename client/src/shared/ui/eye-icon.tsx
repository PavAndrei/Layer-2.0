import type { SVGProps } from 'react';

export const EyeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.25 12C5.15 7.95 8.02 5.92 12 5.92S18.85 7.95 20.75 12C18.85 16.05 15.98 18.08 12 18.08S5.15 16.05 3.25 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="2.85"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
};
