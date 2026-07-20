import type { AdminReviewListItem as AdminReviewListItemData } from '../../../entities/review';
import { AdminReviewListItem } from './admin-review-list-item';

type AdminReviewsListProps = {
  reviews: AdminReviewListItemData[];
};

export const AdminReviewsList = ({ reviews }: AdminReviewsListProps) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {reviews.map((review) => (
      <AdminReviewListItem key={review._id} review={review} />
    ))}
  </div>
);
