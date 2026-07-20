import { AdminReviewsList } from '../admin-reviews';
import {
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import type { AdminReviewsSectionState } from './use-admin-reviews-section';

const AdminReviewsSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-80 w-full" />
    ))}
  </div>
);

export const AdminReviewsSection = ({
  filters,
  onPageChange,
  reviewsQuery,
}: AdminReviewsSectionState) => {
  const isWaitingForInitialReviews =
    reviewsQuery.reviews.length === 0 &&
    (reviewsQuery.isLoading || filters.isDebouncing);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Reviews"
        description="Review customer feedback, product context, and moderation status."
      />

      {isWaitingForInitialReviews && <AdminReviewsSkeleton />}

      {!isWaitingForInitialReviews && reviewsQuery.error && (
        <FeedbackMessage
          title="Reviews could not be loaded"
          description={reviewsQuery.error}
        />
      )}

      {!isWaitingForInitialReviews &&
        !reviewsQuery.error &&
        reviewsQuery.reviews.length === 0 && (
          <FeedbackMessage
            title="No reviews found"
            description="Customer reviews will appear here once they are submitted."
          />
        )}

      {!isWaitingForInitialReviews &&
        !reviewsQuery.error &&
        reviewsQuery.reviews.length > 0 && (
          <>
            <AdminReviewsList reviews={reviewsQuery.reviews} />

            {reviewsQuery.pagination && (
              <Pagination
                currentPage={reviewsQuery.pagination.page}
                limit={reviewsQuery.pagination.limit}
                total={reviewsQuery.pagination.total}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
    </section>
  );
};
