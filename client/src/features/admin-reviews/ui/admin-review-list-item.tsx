import { Link } from 'react-router';

import type { AdminReviewListItem as AdminReviewListItemData } from '../../../entities/review';
import { formatDisplayDate } from '../../../shared/lib';
import { Button, StarRating } from '../../../shared/ui';
import {
  ADMIN_REVIEW_MODERATION_ACTIONS,
  type AdminReviewModerationActionType,
} from '../model';
import { AdminReviewExpandableText } from './admin-review-expandable-text';
import { AdminReviewStatusBadge } from './admin-review-status-badge';

type AdminReviewListItemProps = {
  isActionPending?: boolean;
  pendingActionType?: AdminReviewModerationActionType | null;
  review: AdminReviewListItemData;
  onApproveReview?: (review: AdminReviewListItemData) => void;
  onHideReview?: (review: AdminReviewListItemData) => void;
  onRestoreReview?: (review: AdminReviewListItemData) => void;
};

export const AdminReviewListItem = ({
  isActionPending = false,
  onApproveReview,
  onHideReview,
  onRestoreReview,
  pendingActionType = null,
  review,
}: AdminReviewListItemProps) => {
  const editedLabel = review.editedAt
    ? formatDisplayDate(review.editedAt)
    : null;
  const product = review.product;
  const productTitle = product?.title ?? 'Product removed';
  const isPending = review.status === 'pending';
  const isHidden = review.status === 'rejected';
  const canShowAction =
    (isPending && (onApproveReview || onHideReview)) ||
    (isHidden && onRestoreReview) ||
    (!isPending && !isHidden && onHideReview);
  const getActionLabel = (actionType: AdminReviewModerationActionType) => {
    const config = ADMIN_REVIEW_MODERATION_ACTIONS[actionType];

    return isActionPending && pendingActionType === actionType
      ? config.listPendingLabel
      : config.listLabel;
  };

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

      <AdminReviewExpandableText text={review.text} />
      <div className="mt-auto ml-0 flex flex-col gap-2">
        {product ? (
          <Link
            to={`/products/${product.slug}`}
            className="flex items-center gap-3 rounded border border-border-soft bg-background-primary p-2 transition-colors hover:border-border-strong hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
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
          <div className="flex items-center gap-3 rounded border border-border-soft bg-background-primary p-2">
            <div className="min-w-0">
              <p className="truncate block-medium text-typography-heading">
                {productTitle}
              </p>
            </div>
          </div>
        )}

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
            <span className="block-small text-typography-muted">Purchase</span>
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
      </div>

      {review.moderationReason && (
        <p className="rounded border border-border-soft bg-background-secondary p-2 block-small text-typography-secondary">
          {review.moderationReason}
        </p>
      )}

      {canShowAction && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border-soft pt-3">
          {isPending && onApproveReview && (
            <Button
              disabled={isActionPending}
              size="sm"
              variant="primary"
              onClick={() => onApproveReview(review)}
            >
              {getActionLabel('approve')}
            </Button>
          )}

          {isHidden && onRestoreReview ? (
            <Button
              disabled={isActionPending}
              size="sm"
              variant="secondary"
              onClick={() => onRestoreReview?.(review)}
            >
              {getActionLabel('restore')}
            </Button>
          ) : onHideReview ? (
            <Button
              disabled={isActionPending}
              size="sm"
              variant="danger"
              onClick={() => onHideReview?.(review)}
            >
              {getActionLabel('hide')}
            </Button>
          ) : null}
        </div>
      )}
    </article>
  );
};
