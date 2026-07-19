import { Link } from 'react-router';

import type {
  ReviewFormValues,
  UserReview,
} from '../../../entities/review';
import { formatDisplayDate } from '../../../shared/lib';
import { Button, StarRating } from '../../../shared/ui';
import { ReviewDeleteButton } from './review-delete-button';
import { ReviewEditForm } from './review-edit-form';

type UserReviewListItemProps = {
  isEditing?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  review: UserReview;
  onCancelEdit?: () => void;
  onDelete?: (review: UserReview) => void;
  onEdit?: (review: UserReview) => void;
  onUpdate?: (
    review: UserReview,
    values: ReviewFormValues,
  ) => Promise<{ message?: string; success: boolean }>;
};

export const UserReviewListItem = ({
  isEditing = false,
  isDeleting = false,
  isUpdating = false,
  onCancelEdit,
  onDelete,
  onEdit,
  onUpdate,
  review,
}: UserReviewListItemProps) => {
  const productUrl = review.product
    ? `/products/${review.product.slug}`
    : null;

  if (isEditing && onCancelEdit && onUpdate) {
    return (
      <ReviewEditForm
        isSubmitting={isUpdating}
        review={review}
        onCancel={onCancelEdit}
        onSubmit={(values) => onUpdate(review, values)}
      />
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {review.product ? (
            <Link
              to={productUrl ?? '#'}
              className="shrink-0 overflow-hidden rounded border border-border-soft bg-background-secondary"
            >
              <img
                src={review.product.img}
                alt={review.product.title}
                className="size-16 object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </Link>
          ) : (
            <div className="size-16 shrink-0 rounded border border-border-soft bg-background-secondary" />
          )}

          <div className="flex min-w-0 flex-col gap-1">
            {review.product ? (
              <Link
                to={productUrl ?? '#'}
                className="block-title text-typography-heading transition-colors hover:text-accent-hover"
              >
                {review.product.title}
              </Link>
            ) : (
              <span className="block-title text-typography-heading">
                Product unavailable
              </span>
            )}
            <time
              className="block-small text-typography-secondary"
              dateTime={review.createdAt}
            >
              Reviewed on {formatDisplayDate(review.createdAt)}
            </time>
            {review.editedAt && (
              <time
                className="block-small text-typography-muted"
                dateTime={review.editedAt}
              >
                Edited on {formatDisplayDate(review.editedAt)}
              </time>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <StarRating rating={review.rating} />
          {review.verifiedPurchase && (
            <span className="badge text-accent-primary">
              Verified purchase
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="block-medium text-typography-heading">
          {review.title}
        </h3>
        <p className="block-small text-typography-secondary">
          {review.text}
        </p>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border-soft pt-3">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              disabled={isDeleting || isUpdating}
              onClick={() => onEdit(review)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <ReviewDeleteButton
              isDeleting={isDeleting}
              onDelete={() => onDelete(review)}
            />
          )}
        </div>
      )}
    </article>
  );
};
