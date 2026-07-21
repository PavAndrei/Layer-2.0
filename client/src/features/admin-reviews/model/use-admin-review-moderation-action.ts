import { useCallback, useMemo, useState } from 'react';

import type { AdminReviewListItem } from '../../../entities/review';
import {
  ADMIN_REVIEW_MODERATION_ACTIONS,
  type AdminReviewModerationActionType,
} from './admin-review-moderation-actions';
import { useUpdateAdminReview } from './use-update-admin-review';

type AdminReviewModerationAction = {
  review: AdminReviewListItem;
  type: AdminReviewModerationActionType;
};

export const useAdminReviewModerationAction = () => {
  const [action, setAction] =
    useState<AdminReviewModerationAction | null>(null);
  const updateAdminReviewMutation = useUpdateAdminReview();

  const openApproveDialog = useCallback((review: AdminReviewListItem) => {
    updateAdminReviewMutation.reset();
    setAction({ review, type: 'approve' });
  }, [updateAdminReviewMutation]);

  const openHideDialog = useCallback((review: AdminReviewListItem) => {
    updateAdminReviewMutation.reset();
    setAction({ review, type: 'hide' });
  }, [updateAdminReviewMutation]);

  const openRestoreDialog = useCallback((review: AdminReviewListItem) => {
    updateAdminReviewMutation.reset();
    setAction({ review, type: 'restore' });
  }, [updateAdminReviewMutation]);

  const closeDialog = useCallback(() => {
    if (updateAdminReviewMutation.isPending) return;

    updateAdminReviewMutation.reset();
    setAction(null);
  }, [updateAdminReviewMutation]);

  const confirmAction = useCallback(() => {
    if (!action) return;

    updateAdminReviewMutation.mutate(
      {
        payload: ADMIN_REVIEW_MODERATION_ACTIONS[action.type].payload,
        reviewId: action.review._id,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setAction(null);
          }
        },
      },
    );
  }, [action, updateAdminReviewMutation]);

  const error =
    updateAdminReviewMutation.data && !updateAdminReviewMutation.data.success
      ? updateAdminReviewMutation.data.message
      : updateAdminReviewMutation.error instanceof Error
        ? updateAdminReviewMutation.error.message
        : null;

  return useMemo(
    () => ({
      action,
      closeDialog,
      confirmAction,
      error,
      isPending: updateAdminReviewMutation.isPending,
      openApproveDialog,
      openHideDialog,
      openRestoreDialog,
      pendingActionType: updateAdminReviewMutation.isPending
        ? action?.type ?? null
        : null,
      pendingReviewId: updateAdminReviewMutation.isPending
        ? action?.review._id ?? null
        : null,
    }),
    [
      action,
      closeDialog,
      confirmAction,
      error,
      openHideDialog,
      openApproveDialog,
      openRestoreDialog,
      updateAdminReviewMutation.isPending,
    ],
  );
};

export type AdminReviewModerationActionState = ReturnType<
  typeof useAdminReviewModerationAction
>;
