import type { ReviewStatus } from '../../../entities/review';

type AdminReviewStatusBadgeProps = {
  status: ReviewStatus;
};

const reviewStatusLabels: Record<ReviewStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
};

const reviewStatusClasses: Record<ReviewStatus, string> = {
  approved:
    'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  rejected:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
};

export const AdminReviewStatusBadge = ({
  status,
}: AdminReviewStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${reviewStatusClasses[status]}`}
  >
    {reviewStatusLabels[status]}
  </span>
);
