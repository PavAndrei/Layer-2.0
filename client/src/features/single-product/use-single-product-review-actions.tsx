import { useState } from 'react';
import type { ReactNode } from 'react';

import type {
  ProductReview,
  ReviewFormValues,
} from '../../entities/review';
import { Button } from '../../shared/ui';
import {
  ReviewDeleteButton,
  ReviewEditForm,
  useDeleteReviewAction,
  useUpdateReviewAction,
} from '../reviews';

type UseSingleProductReviewActionsParams = {
  canManageReviews: boolean;
  onReviewDeleted?: (params: { isCurrentUserReview: boolean }) => void;
  onReviewUpdated?: () => void;
};

export const useSingleProductReviewActions = ({
  canManageReviews,
  onReviewDeleted,
  onReviewUpdated,
}: UseSingleProductReviewActionsParams) => {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const reviewDeleteAction = useDeleteReviewAction();
  const reviewUpdateAction = useUpdateReviewAction();

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
      <div className="flex flex-wrap justify-end gap-2">
        {isCurrentUserReview && (
          <Button
            size="sm"
            variant="ghost"
            disabled={
              reviewDeleteAction.isDeletingReview(review._id) ||
              reviewUpdateAction.isUpdatingReview(review._id)
            }
            onClick={() => setEditingReviewId(review._id)}
          >
            Edit
          </Button>
        )}
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
      </div>
    );
  };

  const updateReview = (
    review: ProductReview,
    values: ReviewFormValues,
  ) => {
    return reviewUpdateAction.updateReview(review._id, values, {
      onUpdated: () => {
        setEditingReviewId(null);
        onReviewUpdated?.();
      },
    });
  };

  const renderReviewEditForm = (review: ProductReview): ReactNode => {
    if (editingReviewId !== review._id) return null;

    return (
      <ReviewEditForm
        isSubmitting={reviewUpdateAction.isUpdatingReview(review._id)}
        review={review}
        onCancel={() => setEditingReviewId(null)}
        onSubmit={(values) => updateReview(review, values)}
      />
    );
  };

  return {
    deleteReviewError: reviewDeleteAction.deleteReviewError,
    deleteReviewDialog: reviewDeleteAction.deleteReviewDialog,
    editingReviewId,
    renderReviewActions,
    renderReviewEditForm,
    updateReviewError: reviewUpdateAction.updateReviewError,
  };
};
