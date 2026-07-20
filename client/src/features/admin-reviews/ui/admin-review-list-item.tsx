import type { AdminReviewListItem as AdminReviewListItemData } from '../../../entities/review';
import { formatDisplayDate } from '../../../shared/lib';
import { StarRating } from '../../../shared/ui';
import { AdminReviewStatusBadge } from './admin-review-status-badge';

type AdminReviewListItemProps = {
  review: AdminReviewListItemData;
};

export const AdminReviewListItem = ({
  review,
}: AdminReviewListItemProps) => {
  const editedLabel = review.editedAt
    ? formatDisplayDate(review.editedAt)
    : null;
  const productTitle = review.product?.title ?? 'Product removed';

  return (
    <article className="flex min-h-full flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="block-title text-typography-heading">
            {review.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="block-small text-typography-secondary">
              {review.rating}/5
            </span>
          </div>
        </div>

        <AdminReviewStatusBadge status={review.status} />
      </div>

      <p className="block-small text-typography-secondary">{review.text}</p>

      <div className="flex items-center gap-3 rounded border border-border-soft bg-background-primary p-2">
        {review.product?.img && (
          <img
            alt={productTitle}
            className="h-14 w-14 shrink-0 rounded object-cover"
            src={review.product.img}
          />
        )}
        <div className="min-w-0">
          <p className="truncate block-medium text-typography-heading">
            {productTitle}
          </p>
          {review.product?.slug && (
            <p className="truncate block-small text-typography-secondary">
              {review.product.slug}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="block-small text-typography-muted">Customer</span>
          <span className="truncate block-medium text-typography-primary">
            {review.authorName}
          </span>
          {review.authorEmail && (
            <span className="truncate block-small text-typography-secondary">
              {review.authorEmail}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="block-small text-typography-muted">
            Purchase
          </span>
          <span
            className={`block-medium ${
              review.verifiedPurchase
                ? 'text-accent-primary'
                : 'text-typography-muted'
            }`}
          >
            {review.verifiedPurchase ? 'Verified' : 'Not verified'}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-border-soft pt-3">
        <time
          className="block-small text-typography-muted"
          dateTime={review.createdAt}
        >
          Created {formatDisplayDate(review.createdAt)}
        </time>
        {editedLabel && (
          <time
            className="block-small text-typography-muted"
            dateTime={review.editedAt ?? undefined}
          >
            Edited {editedLabel}
          </time>
        )}
      </div>

      {review.moderationReason && (
        <p className="rounded border border-border-soft bg-background-secondary p-2 block-small text-typography-secondary">
          {review.moderationReason}
        </p>
      )}
    </article>
  );
};
