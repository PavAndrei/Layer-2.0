import type { UserReview } from '../../../entities/review';
import { UserReviewListItem } from './user-review-list-item';

type UserReviewsListProps = {
  deletingReviewId?: string | null;
  reviews: UserReview[];
  onDeleteReview?: (review: UserReview) => void;
};

export const UserReviewsList = ({
  deletingReviewId = null,
  onDeleteReview,
  reviews,
}: UserReviewsListProps) => (
  <div className="flex flex-col gap-3">
    {reviews.map((review) => (
      <UserReviewListItem
        key={review._id}
        isDeleting={deletingReviewId === review._id}
        review={review}
        onDelete={onDeleteReview}
      />
    ))}
  </div>
);
