import { useDeleteReview } from './use-delete-user-review';
import {
  REVIEW_DELETE_CONFIRM_MESSAGE,
  REVIEW_DELETE_FALLBACK_ERROR,
} from './review-action-messages';

type DeleteReviewOptions = {
  onDeleted?: () => void;
};

export const useDeleteReviewAction = () => {
  const deleteReviewMutation = useDeleteReview();

  const deleteReview = (
    reviewId: string,
    options: DeleteReviewOptions = {},
  ) => {
    const isConfirmed = window.confirm(REVIEW_DELETE_CONFIRM_MESSAGE);

    if (!isConfirmed || deleteReviewMutation.isPending) return;

    deleteReviewMutation.mutate(reviewId, {
      onSuccess: (response) => {
        if (!response.success) return;

        options.onDeleted?.();
      },
    });
  };

  const getDeleteReviewError = () => {
    if (deleteReviewMutation.data && !deleteReviewMutation.data.success) {
      return deleteReviewMutation.data.message;
    }

    if (deleteReviewMutation.error) {
      return deleteReviewMutation.error instanceof Error
        ? deleteReviewMutation.error.message
        : REVIEW_DELETE_FALLBACK_ERROR;
    }

    return null;
  };

  const deletingReviewId = deleteReviewMutation.isPending
    ? deleteReviewMutation.variables
    : null;

  return {
    deleteReview,
    deleteReviewError: getDeleteReviewError(),
    deletingReviewId,
    isDeletingReview: (reviewId: string) => deletingReviewId === reviewId,
  };
};
