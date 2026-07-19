import type {
  ReviewFormValues,
  UserReview,
} from '../../../entities/review';
import { UserReviewListItem } from './user-review-list-item';

type UserReviewsListProps = {
  deletingReviewId?: string | null;
  editingReviewId?: string | null;
  reviews: UserReview[];
  updatingReviewId?: string | null;
  onCancelEditReview?: () => void;
  onDeleteReview?: (review: UserReview) => void;
  onEditReview?: (review: UserReview) => void;
  onUpdateReview?: (
    review: UserReview,
    values: ReviewFormValues,
  ) => Promise<{ message?: string; success: boolean }>;
};

export const UserReviewsList = ({
  deletingReviewId = null,
  editingReviewId = null,
  onCancelEditReview,
  onDeleteReview,
  onEditReview,
  onUpdateReview,
  reviews,
  updatingReviewId = null,
}: UserReviewsListProps) => (
  <div className="flex flex-col gap-3">
    {reviews.map((review) => (
      <UserReviewListItem
        key={review._id}
        isDeleting={deletingReviewId === review._id}
        isEditing={editingReviewId === review._id}
        isUpdating={updatingReviewId === review._id}
        review={review}
        onCancelEdit={onCancelEditReview}
        onDelete={onDeleteReview}
        onEdit={onEditReview}
        onUpdate={onUpdateReview}
      />
    ))}
  </div>
);
