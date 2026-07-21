import {
  ADMIN_REVIEW_MODERATION_ACTIONS,
  AdminReviewsFiltersForm,
  AdminReviewsList,
} from '../admin-reviews';
import {
  FeedbackMessage,
  ConfirmDialog,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import { AdminUserFilterChip } from './ui';
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
  moderationAction,
  onPageChange,
  reviewsQuery,
}: AdminReviewsSectionState) => {
  const isWaitingForInitialReviews =
    reviewsQuery.reviews.length === 0 &&
    (reviewsQuery.isLoading || filters.isDebouncing);
  const moderationActionConfig = moderationAction.action
    ? ADMIN_REVIEW_MODERATION_ACTIONS[moderationAction.action.type]
    : null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Reviews"
        description="Review customer feedback, product context, and moderation status."
      />

      <AdminReviewsFiltersForm
        rating={filters.rating}
        search={filters.search}
        verifiedPurchase={filters.verifiedPurchase}
        onRatingChange={filters.handleRatingChange}
        onReset={filters.resetFilters}
        onSearchChange={filters.handleSearchChange}
        onVerifiedPurchaseChange={filters.handleVerifiedPurchaseChange}
      />

      {filters.userId && (
        <AdminUserFilterChip
          userId={filters.userId}
          onClear={filters.clearUserFilter}
        />
      )}

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
            <AdminReviewsList
              pendingActionType={moderationAction.pendingActionType}
              pendingReviewId={moderationAction.pendingReviewId}
              reviews={reviewsQuery.reviews}
              onApproveReview={moderationAction.openApproveDialog}
              onHideReview={moderationAction.openHideDialog}
              onRestoreReview={moderationAction.openRestoreDialog}
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

      <ConfirmDialog
        confirmLabel={moderationActionConfig?.confirmLabel}
        confirmingLabel={moderationActionConfig?.confirmingLabel}
        description={
          moderationAction.error ?? moderationActionConfig?.description
        }
        isConfirming={moderationAction.isPending}
        isOpen={Boolean(moderationAction.action)}
        title={moderationActionConfig?.title ?? 'Review action'}
        tone={moderationActionConfig?.tone ?? 'neutral'}
        onCancel={moderationAction.closeDialog}
        onConfirm={moderationAction.confirmAction}
      />
    </section>
  );
};
