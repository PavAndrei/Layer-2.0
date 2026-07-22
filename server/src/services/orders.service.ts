import {
  QueryFilter,
  Types,
  isObjectIdOrHexString,
} from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import {
  Order,
  type OrderData,
} from '../models/orders.model';
import type {
  OrderResponse,
  OrdersResponse,
} from '../types/api';
import type {
  OrderItemSnapshot,
  OrderShippingAddress,
  OrderShippingSnapshot,
  OrderStatus,
} from '../types/order';
import { orderToDto } from '../utils/order-to-dto';
import {
  createOrderShippingSnapshot,
  calculateShippingTotal,
} from './shipping.service';
import {
  getStoreSettingsDocument,
  storeShippingSettingsToDto,
} from './store-settings.service';

export type GetOrdersOptions = {
  limit?: number;
  page?: number;
  status?: OrderStatus;
};

export type CreateOrderInput = {
  contactEmail: string;
  items: OrderItemSnapshot[];
  shippingAddress: OrderShippingAddress;
};

const DEFAULT_ORDERS_LIMIT = 10;
const MAX_ORDERS_LIMIT = 50;

const validateObjectId = (id: string, message: string) => {
  if (!isObjectIdOrHexString(id)) {
    throw ApiError.BadRequest(message);
  }
};

const getSafePagination = (options: GetOrdersOptions) => {
  const page = Math.max(1, options.page ?? 1);
  const requestedLimit = options.limit ?? DEFAULT_ORDERS_LIMIT;
  const limit = Math.min(Math.max(1, requestedLimit), MAX_ORDERS_LIMIT);

  return {
    page,
    limit,
  };
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getOrderTotals = ({
  items,
  shippingSnapshot,
}: {
  items: OrderItemSnapshot[];
  shippingSnapshot: OrderShippingSnapshot;
}) => {
  const subtotal = items.reduce(
    (total, item) =>
      total +
      Math.max(item.compareAtPrice ?? item.price, item.price) *
        item.quantity,
    0,
  );
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountTotal = subtotal - total;
  const shippingTotal = shippingSnapshot.shippingPrice;

  return {
    subtotal: roundMoney(subtotal),
    discountTotal: roundMoney(discountTotal),
    shippingTotal: roundMoney(shippingTotal),
    total: roundMoney(total + shippingTotal),
  };
};

const getOrderShippingSnapshot = async (items: OrderItemSnapshot[]) => {
  const merchandiseTotal = roundMoney(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const settings = await getStoreSettingsDocument();
  const shippingSettings = storeShippingSettingsToDto(settings);
  const shippingTotal = calculateShippingTotal({
    merchandiseTotal,
    shippingSettings,
  });

  return createOrderShippingSnapshot({
    shippingSettings,
    shippingTotal,
  });
};

export const getOrdersData = async (
  userId: string,
  options: GetOrdersOptions = {},
): Promise<OrdersResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');

  const { page, limit } = getSafePagination(options);
  const filter: QueryFilter<OrderData> = {
    userId: new Types.ObjectId(userId),
  };

  if (options.status) {
    filter.status = options.status;
  }

  const total = await Order.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);

  return {
    orders: orders.map(orderToDto),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
};

export const getOrderByIdData = async (
  userId: string,
  orderId: string,
): Promise<OrderResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');
  validateObjectId(orderId, 'Invalid order id');

  const order = await Order.findOne({
    _id: new Types.ObjectId(orderId),
    userId: new Types.ObjectId(userId),
  });

  if (!order) {
    throw ApiError.NotFound('Order not found');
  }

  return {
    order: orderToDto(order),
  };
};

export const createOrderData = async (
  userId: string,
  input: CreateOrderInput,
): Promise<OrderResponse['data']> => {
  validateObjectId(userId, 'Invalid user id');

  if (input.items.length === 0) {
    throw ApiError.BadRequest('Order must contain at least one item');
  }

  const shippingSnapshot = await getOrderShippingSnapshot(input.items);
  const totals = getOrderTotals({
    items: input.items,
    shippingSnapshot,
  });
  const order = await Order.create({
    userId: new Types.ObjectId(userId),
    status: 'pending',
    items: input.items,
    shippingAddress: input.shippingAddress,
    shippingSnapshot,
    contactEmail: input.contactEmail,
    ...totals,
  });

  return {
    order: orderToDto(order),
  };
};
