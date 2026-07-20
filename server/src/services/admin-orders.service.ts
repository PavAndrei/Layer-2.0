import {
  QueryFilter,
  Types,
} from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import {
  Order,
  type OrderData,
  type OrderDocument,
} from '../models/orders.model';
import type {
  AdminOrderResponse,
  AdminOrdersResponse,
} from '../types/api';
import {
  orderToAdminDto,
  orderToAdminListItemDto,
} from '../utils/order-to-dto';
import type {
  AdminOrdersQuery,
  UpdateAdminOrderBody,
} from '../validators/admin-orders.validators';

const HEX_PATTERN = /^[a-f\d]+$/i;

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSafePagination = (query: AdminOrdersQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const getSearchFilter = (
  search: string,
): QueryFilter<OrderData> => {
  const escapedSearch = escapeRegExp(search);
  const filters: QueryFilter<OrderData>[] = [
    {
      contactEmail: {
        $regex: escapedSearch,
        $options: 'i',
      },
    },
  ];

  if (isValidObjectIdSearch(search)) {
    filters.push({
      _id: new Types.ObjectId(search),
    });
  } else if (HEX_PATTERN.test(search)) {
    filters.push({
      $expr: {
        $regexMatch: {
          input: {
            $toString: '$_id',
          },
          regex: `${escapedSearch}$`,
          options: 'i',
        },
      },
    });
  }

  return {
    $or: filters,
  };
};

const isValidObjectIdSearch = (search: string) => {
  return Types.ObjectId.isValid(search) && search.length === 24;
};

const getAdminOrdersFilter = (
  query: AdminOrdersQuery,
): QueryFilter<OrderData> => {
  const filter: QueryFilter<OrderData> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  if (query.search) {
    Object.assign(filter, getSearchFilter(query.search));
  }

  return filter;
};

export const getAdminOrdersData = async (
  query: AdminOrdersQuery,
): Promise<AdminOrdersResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminOrdersFilter(query);
  const total = await Order.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);

  return {
    orders: orders.map(orderToAdminListItemDto),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
};

const findAdminOrderById = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw ApiError.NotFound('Order not found');
  }

  return order;
};

const toAdminOrderResponseData = (
  order: OrderDocument,
): AdminOrderResponse['data'] => ({
  order: orderToAdminDto(order),
});

const hasOwnField = <Field extends string>(
  value: Record<string, unknown>,
  field: Field,
) => Object.prototype.hasOwnProperty.call(value, field);

export const getAdminOrderData = async (
  orderId: string,
): Promise<AdminOrderResponse['data']> => {
  const order = await findAdminOrderById(orderId);

  return toAdminOrderResponseData(order);
};

type UpdateAdminOrderDataParams = {
  adminUserId: string;
  orderId: string;
  update: UpdateAdminOrderBody;
};

export const updateAdminOrderData = async ({
  adminUserId,
  orderId,
  update,
}: UpdateAdminOrderDataParams): Promise<AdminOrderResponse['data']> => {
  const order = await findAdminOrderById(orderId);

  if (update.status && order.status !== update.status) {
    order.status = update.status;
    order.statusHistory.push({
      changedAt: new Date(),
      changedBy: adminUserId,
      note: update.statusNote,
      status: update.status,
    });
  }

  if (hasOwnField(update, 'trackingNumber')) {
    order.trackingNumber = update.trackingNumber;
  }

  if (hasOwnField(update, 'adminNote')) {
    order.adminNote = update.adminNote;
  }

  await order.save();

  return toAdminOrderResponseData(order);
};
