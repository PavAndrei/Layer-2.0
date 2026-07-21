import { useCallback, useMemo, useState } from 'react';

import type { AdminReviewListItem } from '../../../entities/review';
import { useUpdateAdminReview } from './use-update-admin-review';

type AdminReviewModerationActionType = 'hide' | 'restore';

type AdminReviewModerationAction = {
  review: AdminReviewListItem;
  type: AdminReviewModerationActionType;
};

const getModerationPayload = ({
  type,
}: AdminReviewModerationAction) => {
  if (type === 'hide') {
    return {
      status: 'rejected' as const,
    };
  }

  return {
    moderationReason: '',
    status: 'approved' as const,
  };
};

export const useAdminReviewModerationAction = () => {
  const [action, setAction] =
    useState<AdminReviewModerationAction | null>(null);
  const updateAdminReviewMutation = useUpdateAdminReview();

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
        payload: getModerationPayload(action),
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
      openHideDialog,
      openRestoreDialog,
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
      openRestoreDialog,
      updateAdminReviewMutation.isPending,
    ],
  );
};

export type AdminReviewModerationActionState = ReturnType<
  typeof useAdminReviewModerationAction
>;
