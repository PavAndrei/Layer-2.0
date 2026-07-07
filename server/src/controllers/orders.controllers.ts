import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  getOrderByIdData,
  getOrdersData,
} from '../services/orders.service';
import type {
  OrderResponse,
  OrdersResponse,
} from '../types/api';
import type { OrdersQuery } from '../validators/orders.validators';

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  return req.user.userId;
};

export const getOrders = async (
  req: Request,
  res: Response<OrdersResponse>,
) => {
  const data = await getOrdersData(
    getAuthenticatedUserId(req),
    req.validated?.query as OrdersQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    data,
  });
};

export const getOrderById = async (
  req: Request,
  res: Response<OrderResponse>,
) => {
  const { orderId } = req.validated?.params as { orderId: string };
  const data = await getOrderByIdData(
    getAuthenticatedUserId(req),
    orderId,
  );

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data,
  });
};
