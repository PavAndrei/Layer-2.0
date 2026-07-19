import type { ReactNode } from 'react';

import type { ProductReview } from '../../entities/review';
import { ReviewDeleteButton, useDeleteReviewAction } from '../reviews';

type UseSingleProductReviewActionsParams = {
  canManageReviews: boolean;
  onReviewDeleted?: (params: { isCurrentUserReview: boolean }) => void;
};

export const useSingleProductReviewActions = ({
  canManageReviews,
  onReviewDeleted,
}: UseSingleProductReviewActionsParams) => {
  const reviewDeleteAction = useDeleteReviewAction();

  const canDeleteReview = (
    review: ProductReview,
    currentUserReviewId: string | null,
  ) => {
    return canManageReviews || review._id === currentUserReviewId;
  };

  const deleteReview = ({
    isCurrentUserReview,
    onDeleted,
    review,
  }: {
    isCurrentUserReview: boolean;
    onDeleted: () => void;
    review: ProductReview;
  }) => {
    reviewDeleteAction.deleteReview(review._id, {
      onDeleted: () => {
        onReviewDeleted?.({ isCurrentUserReview });
        onDeleted();
      },
    });
  };

  const renderReviewActions = (
    review: ProductReview,
    {
      currentUserReviewId,
      resetReviews,
    }: {
      currentUserReviewId: string | null;
      resetReviews: () => void;
    },
  ): ReactNode => {
    const isCurrentUserReview = review._id === currentUserReviewId;

    if (!canDeleteReview(review, currentUserReviewId)) return null;

    return (
      <ReviewDeleteButton
        isDeleting={reviewDeleteAction.isDeletingReview(review._id)}
        onDelete={() =>
          deleteReview({
            isCurrentUserReview,
            onDeleted: resetReviews,
            review,
          })
        }
      />
    );
  };

  return {
    deleteReviewError: reviewDeleteAction.deleteReviewError,
    deleteReviewDialog: reviewDeleteAction.deleteReviewDialog,
    renderReviewActions,
  };
};
