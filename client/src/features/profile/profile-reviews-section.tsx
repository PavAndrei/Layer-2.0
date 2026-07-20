import {
  ConfirmDialog,
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import {
  UserReviewsEmptyState,
  UserReviewsList,
} from '../reviews';
import type { ProfileReviewsSectionState } from './use-profile-reviews-section';

export const ProfileReviewsSection = ({
  deleteReviewError,
  deleteReviewDialog,
  deletingReviewId,
  editingReviewId,
  onCancelEditReview,
  onDeleteReview,
  onEditReview,
  onPageChange,
  onUpdateReview,
  reviewsQuery,
  updateReviewError,
  updatingReviewId,
}: ProfileReviewsSectionState) => {
  return (
    <>
      <ConfirmDialog {...deleteReviewDialog} />
      <SectionHeader
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
      {updateReviewError && (
        <FeedbackMessage
          tone="danger"
          title="Could not update review"
          description={updateReviewError}
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
            editingReviewId={editingReviewId}
            reviews={reviewsQuery.reviews}
            updatingReviewId={updatingReviewId}
            onCancelEditReview={onCancelEditReview}
            onDeleteReview={onDeleteReview}
            onEditReview={onEditReview}
            onUpdateReview={onUpdateReview}
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
