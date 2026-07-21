import type { UpdateAdminReviewData } from '../../../entities/review';

export type AdminReviewModerationActionType =
  | 'approve'
  | 'hide'
  | 'restore';

export type AdminReviewModerationActionConfig = {
  confirmLabel: string;
  confirmingLabel: string;
  description: string;
  listLabel: string;
  listPendingLabel: string;
  payload: UpdateAdminReviewData;
  title: string;
  tone: 'neutral' | 'danger';
};

export const ADMIN_REVIEW_MODERATION_ACTIONS: Record<
  AdminReviewModerationActionType,
  AdminReviewModerationActionConfig
> = {
  approve: {
    confirmLabel: 'Approve',
    confirmingLabel: 'Approving...',
    description:
      'This pending review will become visible on the product page.',
    listLabel: 'Approve',
    listPendingLabel: 'Approving...',
    payload: {
      status: 'approved',
    },
    title: 'Approve review?',
    tone: 'neutral',
  },
  hide: {
    confirmLabel: 'Hide',
    confirmingLabel: 'Hiding...',
    description: 'This review will be hidden from the product page.',
    listLabel: 'Hide',
    listPendingLabel: 'Hiding...',
    payload: {
      status: 'rejected',
    },
    title: 'Hide review?',
    tone: 'danger',
  },
  restore: {
    confirmLabel: 'Restore',
    confirmingLabel: 'Restoring...',
    description:
      'This review will become visible again on the product page.',
    listLabel: 'Restore',
    listPendingLabel: 'Restoring...',
    payload: {
      moderationReason: '',
      status: 'approved',
    },
    title: 'Restore review?',
    tone: 'neutral',
  },
};
