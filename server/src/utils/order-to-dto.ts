import type { OrderDocument } from '../models/orders.model';
import type {
  AdminOrderDto,
  AdminOrderListItemDto,
  AdminUserRecentOrderDto,
  OrderDto,
  OrderStatusHistoryDto,
} from '../types/api';
import type {
  OrderPaymentStatus,
  OrderStatusHistoryItem,
} from '../types/order';

const getOrderNumber = (orderId: string) => orderId.slice(-8).toUpperCase();

const getCustomerName = (order: OrderDocument) => {
  const { firstName, lastName } = order.shippingAddress;

  return [firstName, lastName].filter(Boolean).join(' ');
};

const getItemsCount = (order: OrderDocument) => {
  return order.items.reduce((total, item) => total + item.quantity, 0);
};

const optionalString = (value: string | null | undefined) => {
  return value ?? undefined;
};

const getPaymentStatus = (
  order: OrderDocument,
): OrderPaymentStatus => {
  if (order.paymentStatus) return order.paymentStatus;

  if (
    order.status === 'paid' ||
    order.status === 'processing' ||
    order.status === 'completed'
  ) {
    return 'paid';
  }

  return 'pending';
};

const getStatusHistory = (
  order: OrderDocument,
): OrderStatusHistoryItem[] => {
  if (order.statusHistory?.length > 0) {
    return order.statusHistory;
  }

  return [
    {
      changedAt: order.createdAt,
      status: order.status,
    },
  ];
};

const orderStatusHistoryToDto = (
  statusHistory: OrderStatusHistoryItem[] | undefined,
): OrderStatusHistoryDto[] => {
  return (statusHistory ?? []).map((item) => ({
    changedAt: item.changedAt.toISOString(),
    changedBy: item.changedBy,
    note: item.note,
    status: item.status,
  }));
};

export const orderToDto = (order: OrderDocument): OrderDto => ({
  _id: order._id.toString(),
  userId: order.userId.toString(),
  status: order.status,
  paymentStatus: getPaymentStatus(order),
  items: order.items.map((item) => ({
    productId: item.productId,
    productSlug: item.productSlug,
    variantId: item.variantId,
    sku: item.sku,
    title: item.title,
    image: item.image,
    color: item.color,
    size: item.size,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    quantity: item.quantity,
  })),
  shippingAddress: {
    firstName: order.shippingAddress.firstName,
    lastName: order.shippingAddress.lastName,
    addressLine1: order.shippingAddress.addressLine1,
    addressLine2: order.shippingAddress.addressLine2,
    city: order.shippingAddress.city,
    region: order.shippingAddress.region,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
    phone: order.shippingAddress.phone,
  },
  contactEmail: order.contactEmail,
  subtotal: order.subtotal,
  discountTotal: order.discountTotal,
  total: order.total,
  trackingNumber: optionalString(order.trackingNumber),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});

export const orderToAdminListItemDto = (
  order: OrderDocument,
): AdminOrderListItemDto => ({
  _id: order._id.toString(),
  contactEmail: order.contactEmail,
  createdAt: order.createdAt.toISOString(),
  customerName: getCustomerName(order),
  itemsCount: getItemsCount(order),
  orderNumber: getOrderNumber(order._id.toString()),
  paymentStatus: getPaymentStatus(order),
  status: order.status,
  total: order.total,
  trackingNumber: optionalString(order.trackingNumber),
  updatedAt: order.updatedAt.toISOString(),
});

export const orderToAdminUserRecentOrderDto = (
  order: OrderDocument,
): AdminUserRecentOrderDto => ({
  _id: order._id.toString(),
  createdAt: order.createdAt.toISOString(),
  orderNumber: getOrderNumber(order._id.toString()),
  paymentStatus: getPaymentStatus(order),
  status: order.status,
  total: order.total,
});

export const orderToAdminDto = (
  order: OrderDocument,
): AdminOrderDto => ({
  ...orderToDto(order),
  adminNote: optionalString(order.adminNote),
  customerName: getCustomerName(order),
  itemsCount: getItemsCount(order),
  orderNumber: getOrderNumber(order._id.toString()),
  statusHistory: orderStatusHistoryToDto(getStatusHistory(order)),
});
