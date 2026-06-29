export const REVIEW_STATUSES = ['approved', 'pending', 'rejected'] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
