import type { UserReview } from '../../../entities/review';
import { UserReviewListItem } from './user-review-list-item';

type UserReviewsListProps = {
  reviews: UserReview[];
};

export const UserReviewsList = ({ reviews }: UserReviewsListProps) => (
  <div className="flex flex-col gap-3">
    {reviews.map((review) => (
      <UserReviewListItem key={review._id} review={review} />
    ))}
  </div>
);
