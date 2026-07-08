import type { OrderStatus } from '../../../entities/order';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusClasses: Record<OrderStatus, string> = {
  pending: 'border-border-strong bg-background-secondary text-typography-primary',
  paid: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  processing:
    'border-accent-primary/30 bg-background-secondary text-accent-primary',
  completed:
    'border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary',
  cancelled: 'border-border-strong bg-background-secondary text-typography-muted',
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${statusClasses[status]}`}
  >
    {statusLabels[status]}
  </span>
);
