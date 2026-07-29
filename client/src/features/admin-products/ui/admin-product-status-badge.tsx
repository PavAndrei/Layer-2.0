import type { ProductStatus } from '../../../entities/product';

type AdminProductStatusBadgeProps = {
  status: ProductStatus;
};

const statusLabels: Record<ProductStatus, string> = {
  active: 'Active',
  archived: 'Archived',
  draft: 'Draft',
};

const statusClasses: Record<ProductStatus, string> = {
  active:
    'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  archived:
    'border-border-strong bg-background-secondary text-typography-muted',
  draft:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
};

export const AdminProductStatusBadge = ({
  status,
}: AdminProductStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${statusClasses[status]}`}
  >
    {statusLabels[status]}
  </span>
);
