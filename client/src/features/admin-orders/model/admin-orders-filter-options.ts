import {
  ORDER_PAYMENT_STATUSES,
  ORDER_STATUSES,
  type OrderPaymentStatus,
  type OrderStatus,
} from '../../../entities/order';
import type { SelectFilterOption } from '../../../shared/ui';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  ADMIN_ORDER_STATUS_LABELS,
} from './admin-order-labels';

export type AdminOrderStatusFilterValue = OrderStatus | '';
export type AdminOrderPaymentStatusFilterValue = OrderPaymentStatus | '';

export type AdminOrderStatusFilterOption =
  SelectFilterOption<AdminOrderStatusFilterValue>;

export type AdminOrderPaymentStatusFilterOption =
  SelectFilterOption<AdminOrderPaymentStatusFilterValue>;

export const ADMIN_ORDER_STATUS_OPTIONS: readonly SelectFilterOption<OrderStatus>[] =
  ORDER_STATUSES.map((status) => ({
    label: ADMIN_ORDER_STATUS_LABELS[status],
    value: status,
  }));

export const ADMIN_ORDER_STATUS_FILTER_OPTIONS: readonly AdminOrderStatusFilterOption[] = [
  { label: 'All statuses', value: '' },
  ...ADMIN_ORDER_STATUS_OPTIONS,
];

export const ADMIN_ORDER_PAYMENT_STATUS_FILTER_OPTIONS: readonly AdminOrderPaymentStatusFilterOption[] = [
  { label: 'All payment statuses', value: '' },
  ...ORDER_PAYMENT_STATUSES.map((status) => ({
    label: ADMIN_ORDER_PAYMENT_STATUS_LABELS[status],
    value: status,
  })),
];
