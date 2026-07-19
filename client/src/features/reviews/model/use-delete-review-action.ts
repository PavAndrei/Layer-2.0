import { useConfirmDialog } from '../../../shared/hooks';
import { useDeleteReview } from './use-delete-user-review';
import {
  REVIEW_DELETE_CANCEL_LABEL,
  REVIEW_DELETE_CONFIRM_DESCRIPTION,
  REVIEW_DELETE_CONFIRM_LABEL,
  REVIEW_DELETE_CONFIRM_TITLE,
  REVIEW_DELETE_FALLBACK_ERROR,
} from './review-action-messages';

type DeleteReviewOptions = {
  onDeleted?: () => void;
};

type DeleteReviewPayload = DeleteReviewOptions & {
  reviewId: string;
};

export const useDeleteReviewAction = () => {
  const confirmDialog = useConfirmDialog<DeleteReviewPayload>();
  const deleteReviewMutation = useDeleteReview();

  const deleteReview = (
    reviewId: string,
    options: DeleteReviewOptions = {},
  ) => {
    if (deleteReviewMutation.isPending) return;

    confirmDialog.open({
      ...options,
      reviewId,
    });
  };

  const confirmDeleteReview = () => {
    if (!confirmDialog.payload || deleteReviewMutation.isPending) return;

    const { onDeleted, reviewId } = confirmDialog.payload;

    deleteReviewMutation.mutate(reviewId, {
      onSuccess: (response) => {
        if (response.success) {
          onDeleted?.();
        }

        confirmDialog.close();
      },
      onError: () => {
        confirmDialog.close();
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
    deleteReviewDialog: {
      cancelLabel: REVIEW_DELETE_CANCEL_LABEL,
      confirmLabel: REVIEW_DELETE_CONFIRM_LABEL,
      confirmingLabel: 'Deleting...',
      description: REVIEW_DELETE_CONFIRM_DESCRIPTION,
      isConfirming: deleteReviewMutation.isPending,
      isOpen: confirmDialog.isOpen,
      title: REVIEW_DELETE_CONFIRM_TITLE,
      tone: 'danger' as const,
      onCancel: confirmDialog.close,
      onConfirm: confirmDeleteReview,
    },
    deletingReviewId,
    isDeletingReview: (reviewId: string) => deletingReviewId === reviewId,
  };
};
