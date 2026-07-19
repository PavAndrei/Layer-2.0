import type { ReactNode } from 'react';

import type { ProductReview } from '../../entities/review';
import { ReviewDeleteButton, useDeleteReviewAction } from '../reviews';

type UseSingleProductReviewActionsParams = {
  canManageReviews: boolean;
  onReviewDeleted?: () => void;
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

  const deleteReview = (review: ProductReview, onDeleted: () => void) => {
    reviewDeleteAction.deleteReview(review._id, {
      onDeleted: () => {
        onReviewDeleted?.();
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
    if (!canDeleteReview(review, currentUserReviewId)) return null;

    return (
      <ReviewDeleteButton
        isDeleting={reviewDeleteAction.isDeletingReview(review._id)}
        onDelete={() => deleteReview(review, resetReviews)}
      />
    );
  };

  return {
    deleteReviewError: reviewDeleteAction.deleteReviewError,
    renderReviewActions,
  };
};
