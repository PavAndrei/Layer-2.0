import { StarIcon } from './star-icon';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
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

        return (
          <StarIcon
            key={index}
            className="h-5.5 w-5.5"
            fillPercent={fillPercent}
          />
        );
      })}
    </div>
  );
};
