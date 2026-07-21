import { Link } from 'react-router';

import type {
  AdminUserRecentReview,
  ReviewStatus,
} from '../../../entities/review';
import { formatDisplayDate } from '../../../shared/lib';
import { StarRating } from '../../../shared/ui';

type AdminUserRecentReviewItemProps = {
  review: AdminUserRecentReview;
};

const REVIEW_TEXT_PREVIEW_LENGTH = 180;

const reviewStatusLabels: Record<ReviewStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Hidden',
};

const reviewStatusClasses: Record<ReviewStatus, string> = {
  approved:
    'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  rejected:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
};

const getReviewTextPreview = (text: string) => {
  if (text.length <= REVIEW_TEXT_PREVIEW_LENGTH) {
    return text;
  }

  return `${text.slice(0, REVIEW_TEXT_PREVIEW_LENGTH).trimEnd()}...`;
};

const AdminUserRecentReviewStatusBadge = ({
  status,
}: {
  status: ReviewStatus;
}) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${reviewStatusClasses[status]}`}
  >
    {reviewStatusLabels[status]}
  </span>
);

export const AdminUserRecentReviewItem = ({
  review,
}: AdminUserRecentReviewItemProps) => {
  const product = review.product;
  const productTitle = product?.title ?? 'Product removed';

  return (
    <li className="grid gap-4 border-t border-border-soft py-4 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)_auto] lg:items-start">
      {product ? (
        <Link
          to={`/products/${product.slug}`}
          className="flex min-w-0 items-center gap-3 rounded border border-border-soft bg-background-primary p-2 transition-colors hover:border-border-strong hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        >
          {product.img && (
            <img
              alt={productTitle}
              className="h-14 w-14 shrink-0 rounded object-cover"
              src={product.img}
            />
          )}
          <div className="min-w-0">
            <p className="truncate block-medium text-typography-heading">
              {productTitle}
            </p>
            <p className="truncate block-small text-typography-secondary">
              {product.slug}
            </p>
          </div>
        </Link>
      ) : (
        <div className="rounded border border-border-soft bg-background-primary p-2">
          <p className="truncate block-medium text-typography-heading">
            {productTitle}
          </p>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StarRating rating={review.rating} />
          <span className="block-small text-typography-secondary">
            {review.rating}/5
          </span>
        </div>
        <h3 className="block-medium text-typography-heading">
          {review.title}
        </h3>
        <p className="block-small text-typography-secondary">
          {getReviewTextPreview(review.text)}
        </p>
      </div>

      <div className="flex flex-col gap-2 lg:items-end">
        <AdminUserRecentReviewStatusBadge status={review.status} />
        <time
          className="block-small text-typography-muted"
          dateTime={review.createdAt}
        >
          {formatDisplayDate(review.createdAt)}
        </time>
      </div>
    </li>
  );
};
