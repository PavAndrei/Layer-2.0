import type { ProductReview } from '../model';
import { formatDisplayDate } from '../../../shared/lib';
import { StarRating } from '../../../shared/ui';

type ReviewCardProps = {
  review: ProductReview;
};

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <article className="flex flex-col gap-2 rounded border border-border-soft bg-background-surface p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="block-medium text-typography-heading">
            {review.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={review.rating} />
            {review.verifiedPurchase && (
              <span className="badge text-accent-primary">
                Verified purchase
              </span>
            )}
          </div>
        </div>
        <time
          className="block-small text-typography-muted"
          dateTime={review.createdAt}
        >
          {formatDisplayDate(review.createdAt)}
        </time>
      </div>

      <p className="block-small text-typography-secondary">{review.text}</p>
      <p className="block-micro text-typography-muted">
        Reviewed by {review.authorName}
      </p>
    </article>
  );
};
