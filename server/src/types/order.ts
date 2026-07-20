import type { ProductSize } from './product-variant';

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'completed',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
] as const;

export type OrderPaymentStatus =
  (typeof ORDER_PAYMENT_STATUSES)[number];

export type OrderStatusHistoryItem = {
  changedAt: Date;
  changedBy?: string;
  note?: string;
  status: OrderStatus;
};

export type OrderItemSnapshot = {
  compareAtPrice?: number;
  color: string;
  image: string;
  price: number;
  productId: string;
  productSlug: string;
  quantity: number;
  size: ProductSize;
  sku: string;
  title: string;
  variantId: string;
};

export type OrderShippingAddress = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  phone?: string;
  postalCode: string;
  region?: string;
};
