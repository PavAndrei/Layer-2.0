import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  getAdminOrderData,
  getAdminOrdersData,
  updateAdminOrderData,
} from '../services/admin-orders.service';
import type {
  AdminMeResponse,
  AdminOrderResponse,
  AdminOrdersResponse,
} from '../types/api';
import { userToDto } from '../utils/user-to-dto';
import type {
  AdminOrderParams,
  AdminOrdersQuery,
  UpdateAdminOrderBody,
} from '../validators/admin-orders.validators';

export const getAdminMe = async (
  req: Request,
  res: Response<AdminMeResponse>,
) => {
  if (!req.currentUser) {
    throw ApiError.Unauthorized();
  }

  res.status(200).json({
    success: true,
    message: 'Admin user fetched successfully',
    data: {
      user: userToDto(req.currentUser),
    },
  });
};

export const getAdminOrders = async (
  req: Request,
  res: Response<AdminOrdersResponse>,
) => {
  const data = await getAdminOrdersData(
    req.validated?.query as AdminOrdersQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Admin orders fetched successfully',
    data,
  });
};

export const getAdminOrder = async (
  req: Request,
  res: Response<AdminOrderResponse>,
) => {
  const { orderId } = req.validated?.params as AdminOrderParams;
  const data = await getAdminOrderData(orderId);

  res.status(200).json({
    success: true,
    message: 'Admin order fetched successfully',
    data,
  });
};

export const updateAdminOrder = async (
  req: Request,
  res: Response<AdminOrderResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { orderId } = req.validated?.params as AdminOrderParams;
  const body = req.validated?.body as UpdateAdminOrderBody;
  const data = await updateAdminOrderData({
    adminUserId: req.user.userId,
    orderId,
    update: body,
  });

  res.status(200).json({
    success: true,
    message: 'Admin order updated successfully',
    data,
  });
};
