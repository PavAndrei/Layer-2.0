type StarRatingProps = {
  rating: number;
  maxRating?: number;
};

const STAR_PATH =
  'M11 1.8 13.9 7.7 20.4 8.6 15.7 13.2 16.8 19.7 11 16.6 5.2 19.7 6.3 13.2 1.6 8.6 8.1 7.7 11 1.8Z';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const StarIcon = ({ fillPercent }: { fillPercent: number }) => {
  return (
    <span className="relative block h-5.5 w-5.5" aria-hidden="true">
      <svg
        viewBox="0 0 22 22"
        className="h-5.5 w-5.5 text-border-active"
        fill="currentColor"
      >
        <path d={STAR_PATH} />
      </svg>
      <span
        className="absolute inset-0 block overflow-hidden text-accent-secondary"
        style={{ width: `${fillPercent}%` }}
      >
        <svg viewBox="0 0 22 22" className="h-5.5 w-5.5" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      </span>
    </span>
  );
};

export const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  const normalizedRating = clamp(rating, 0, maxRating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating ${normalizedRating.toFixed(1)} out of ${maxRating}`}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const fillPercent = clamp((normalizedRating - index) * 100, 0, 100);

        return <StarIcon key={index} fillPercent={fillPercent} />;
      })}
    </div>
  );
};
