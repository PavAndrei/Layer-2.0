export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'completed',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_ITEM_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'ONE_SIZE',
] as const;

export type OrderItemSize = (typeof ORDER_ITEM_SIZES)[number];

export type OrderItemSnapshot = {
  compareAtPrice?: number;
  color: string;
  image: string;
  price: number;
  productId: string;
  productSlug: string;
  quantity: number;
  size: OrderItemSize;
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

export type Order = {
  _id: string;
  contactEmail: string;
  createdAt: string;
  discountTotal: number;
  items: OrderItemSnapshot[];
  shippingAddress: OrderShippingAddress;
  status: OrderStatus;
  subtotal: number;
  total: number;
  updatedAt: string;
  userId: string;
};
