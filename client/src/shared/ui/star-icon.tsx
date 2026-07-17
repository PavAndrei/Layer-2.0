type StarIconProps = {
  className?: string;
  emptyClassName?: string;
  fillClassName?: string;
  fillPercent?: number;
};

export const STAR_PATH =
  'M11 1.8 13.9 7.7 20.4 8.6 15.7 13.2 16.8 19.7 11 16.6 5.2 19.7 6.3 13.2 1.6 8.6 8.1 7.7 11 1.8Z';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const StarIcon = ({
  className = 'h-5.5 w-5.5',
  emptyClassName = 'text-border-active',
  fillClassName = 'text-accent-secondary',
  fillPercent = 100,
}: StarIconProps) => {
  const normalizedFillPercent = clamp(fillPercent, 0, 100);

  return (
    <span className={`relative block ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 22 22"
        className={`${className} ${emptyClassName}`}
        fill="currentColor"
      >
        <path d={STAR_PATH} />
      </svg>
      {normalizedFillPercent > 0 && (
        <span
          className={`absolute inset-0 block overflow-hidden ${fillClassName}`}
          style={{ width: `${normalizedFillPercent}%` }}
        >
          <svg viewBox="0 0 22 22" className={className} fill="currentColor">
            <path d={STAR_PATH} />
          </svg>
        </span>
      )}
    </span>
  );
};
