import type {
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';

type AdminOrderStatusBadgeProps = {
  status: OrderStatus;
};

type AdminOrderPaymentStatusBadgeProps = {
  status: OrderPaymentStatus;
};

const orderStatusLabels: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  paid: 'Paid',
  pending: 'Pending',
  processing: 'Processing',
};

const orderStatusClasses: Record<OrderStatus, string> = {
  cancelled:
    'border-border-strong bg-background-secondary text-typography-muted',
  completed:
    'border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary',
  paid: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  processing:
    'border-accent-primary/30 bg-background-secondary text-accent-primary',
};

const paymentStatusLabels: Record<OrderPaymentStatus, string> = {
  failed: 'Payment failed',
  paid: 'Paid',
  pending: 'Payment pending',
  refunded: 'Refunded',
};

const paymentStatusClasses: Record<OrderPaymentStatus, string> = {
  failed:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
  paid: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  pending:
    'border-border-strong bg-background-secondary text-typography-primary',
  refunded:
    'border-border-strong bg-background-secondary text-typography-muted',
};

export const AdminOrderStatusBadge = ({
  status,
}: AdminOrderStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${orderStatusClasses[status]}`}
  >
    {orderStatusLabels[status]}
  </span>
);

export const AdminOrderPaymentStatusBadge = ({
  status,
}: AdminOrderPaymentStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${paymentStatusClasses[status]}`}
  >
    {paymentStatusLabels[status]}
  </span>
);
