import type { AdminReviewListItem as AdminReviewListItemData } from '../../../entities/review';
import { AdminReviewListItem } from './admin-review-list-item';

type AdminReviewsListProps = {
  pendingReviewId?: string | null;
  reviews: AdminReviewListItemData[];
  onHideReview?: (review: AdminReviewListItemData) => void;
  onRestoreReview?: (review: AdminReviewListItemData) => void;
};

export const AdminReviewsList = ({
  pendingReviewId = null,
  reviews,
  onHideReview,
  onRestoreReview,
}: AdminReviewsListProps) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {reviews.map((review) => (
      <AdminReviewListItem
        key={review._id}
        isActionPending={pendingReviewId === review._id}
        review={review}
        onHideReview={onHideReview}
        onRestoreReview={onRestoreReview}
      />
    ))}
  </div>
);
