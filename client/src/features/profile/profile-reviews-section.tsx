import {
  ConfirmDialog,
  FeedbackMessage,
  Pagination,
  Skeleton,
} from '../../shared/ui';
import {
  UserReviewsEmptyState,
  UserReviewsList,
} from '../reviews';
import { ProfileSectionHeader } from './ui';
import type { ProfileReviewsSectionState } from './use-profile-reviews-section';

export const ProfileReviewsSection = ({
  deleteReviewError,
  deleteReviewDialog,
  deletingReviewId,
  onDeleteReview,
  onPageChange,
  reviewsQuery,
}: ProfileReviewsSectionState) => {
  return (
    <>
      <ConfirmDialog {...deleteReviewDialog} />
      <ProfileSectionHeader
        title="Reviews"
        description="Review the product feedback you have shared."
      />
      {reviewsQuery.isLoading && <Skeleton className="h-48 w-full" />}
      {reviewsQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Reviews are unavailable"
          description={reviewsQuery.error}
        />
      )}
      {deleteReviewError && (
        <FeedbackMessage
          tone="danger"
          title="Could not delete review"
          description={deleteReviewError}
        />
      )}
      {!reviewsQuery.isLoading &&
        !reviewsQuery.error &&
        reviewsQuery.reviews.length === 0 && <UserReviewsEmptyState />}
      {!reviewsQuery.isLoading &&
        !reviewsQuery.error &&
        reviewsQuery.reviews.length > 0 && (
        <>
          <UserReviewsList
            deletingReviewId={deletingReviewId}
            reviews={reviewsQuery.reviews}
            onDeleteReview={onDeleteReview}
          />
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
    </>
  );
};
