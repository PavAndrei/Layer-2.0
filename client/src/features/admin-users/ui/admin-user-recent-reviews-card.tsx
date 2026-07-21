import { Link } from 'react-router';

import type { AdminUserRecentReview } from '../../../entities/review';
import { AdminUserRecentReviewItem } from './admin-user-recent-review-item';

type AdminUserRecentReviewsCardProps = {
  reviews: AdminUserRecentReview[];
  userId: string;
};

const getAllReviewsUrl = (userId: string) => {
  const searchParams = new URLSearchParams({
    section: 'reviews',
    userId,
  });

  return `/admin?${searchParams.toString()}`;
};

export const AdminUserRecentReviewsCard = ({
  reviews,
  userId,
}: AdminUserRecentReviewsCardProps) => (
  <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="block-title text-typography-heading">Recent reviews</h2>
        <p className="block-small text-typography-secondary">
          Latest five reviews written by this user.
        </p>
      </div>

      <Link
        to={getAllReviewsUrl(userId)}
        className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
      >
        View all reviews
      </Link>
    </div>

    {reviews.length > 0 ? (
      <ul className="flex flex-col">
        {reviews.map((review) => (
          <AdminUserRecentReviewItem key={review._id} review={review} />
        ))}
      </ul>
    ) : (
      <div className="rounded border border-border-soft bg-background-secondary p-4">
        <p className="block-small text-typography-secondary">
          This user has not written any reviews yet.
        </p>
      </div>
    )}
  </section>
);
