import type {
  OrderPaymentStatus,
  OrderStatus,
} from '../../../entities/order';

export const ADMIN_ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  paid: 'Paid',
  pending: 'Pending',
  processing: 'Processing',
};

export const ADMIN_ORDER_PAYMENT_STATUS_LABELS: Record<
  OrderPaymentStatus,
  string
> = {
  failed: 'Payment failed',
  paid: 'Paid',
  pending: 'Payment pending',
  refunded: 'Refunded',
};
