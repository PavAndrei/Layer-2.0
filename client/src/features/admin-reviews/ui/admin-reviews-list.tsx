import type { AdminReviewListItem as AdminReviewListItemData } from '../../../entities/review';
import type { AdminReviewModerationActionType } from '../model';
import { AdminReviewListItem } from './admin-review-list-item';

type AdminReviewsListProps = {
  pendingActionType?: AdminReviewModerationActionType | null;
  pendingReviewId?: string | null;
  reviews: AdminReviewListItemData[];
  onApproveReview?: (review: AdminReviewListItemData) => void;
  onHideReview?: (review: AdminReviewListItemData) => void;
  onRestoreReview?: (review: AdminReviewListItemData) => void;
};

export const AdminReviewsList = ({
  pendingActionType = null,
  pendingReviewId = null,
  reviews,
  onApproveReview,
  onHideReview,
  onRestoreReview,
}: AdminReviewsListProps) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {reviews.map((review) => (
      <AdminReviewListItem
        key={review._id}
        isActionPending={pendingReviewId === review._id}
        pendingActionType={pendingActionType}
        review={review}
        onApproveReview={onApproveReview}
        onHideReview={onHideReview}
        onRestoreReview={onRestoreReview}
      />
    ))}
  </div>
);
