import { Link } from 'react-router';

import type {
  AdminReviewListItem,
  ReviewStatus,
} from '../../../entities/review';
import { formatDisplayDate } from '../../../shared/lib';
import { StarRating } from '../../../shared/ui';

const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Hidden',
};

const getReviewPreview = (text: string) => {
  const previewLimit = 120;

  return text.length > previewLimit
    ? `${text.slice(0, previewLimit).trim()}...`
    : text;
};

type AdminDashboardRecentReviewsProps = {
  reviews: AdminReviewListItem[];
};

export const AdminDashboardRecentReviews = ({
  reviews,
}: AdminDashboardRecentReviewsProps) => (
  <section className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">Recent reviews</h3>
      <p className="block-small text-typography-secondary">
        Latest customer feedback and moderation state.
      </p>
    </div>

    {reviews.length === 0 ? (
      <p className="block-small text-typography-secondary">
        No reviews found in this period.
      </p>
    ) : (
      <div className="flex flex-col divide-y divide-border-soft">
        {reviews.map((review) => (
          <article key={review._id} className="flex flex-col gap-2 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate block-medium text-typography-heading">
                  {review.title}
                </p>
                <p className="truncate block-small text-typography-secondary">
                  {review.product?.title ?? 'Product removed'}
                </p>
              </div>
              <span className="shrink-0 block-small text-typography-secondary">
                {REVIEW_STATUS_LABELS[review.status]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="block-small text-typography-secondary">
                {review.rating}/5
              </span>
            </div>

            <p className="block-small text-typography-secondary">
              {getReviewPreview(review.text)}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {review.authorId ? (
                <Link
                  to={`/admin/users/${review.authorId}`}
                  className="block-small text-accent-primary transition-colors hover:text-accent-hover hover:underline"
                >
                  {review.authorName}
                </Link>
              ) : (
                <span className="block-small text-typography-secondary">
                  {review.authorName}
                </span>
              )}
              <time
                dateTime={review.createdAt}
                className="block-small text-typography-muted"
              >
                {formatDisplayDate(review.createdAt)}
              </time>
            </div>
          </article>
        ))}
      </div>
    )}

    <Link
      to="/admin?section=reviews"
      className="mt-auto block-small text-accent-primary transition-colors hover:text-accent-hover hover:underline"
    >
      View all reviews
    </Link>
  </section>
);
