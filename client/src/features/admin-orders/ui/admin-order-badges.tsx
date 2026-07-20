import type {
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  ADMIN_ORDER_STATUS_LABELS,
} from '../model';

type AdminOrderStatusBadgeProps = {
  status: OrderStatus;
};

type AdminOrderPaymentStatusBadgeProps = {
  status: OrderPaymentStatus;
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
    {ADMIN_ORDER_STATUS_LABELS[status]}
  </span>
);

export const AdminOrderPaymentStatusBadge = ({
  status,
}: AdminOrderPaymentStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${paymentStatusClasses[status]}`}
>
    {ADMIN_ORDER_PAYMENT_STATUS_LABELS[status]}
  </span>
);
