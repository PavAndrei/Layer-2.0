import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import { getAdminOrdersData } from '../services/admin-orders.service';
import type {
  AdminMeResponse,
  AdminOrdersResponse,
} from '../types/api';
import { userToDto } from '../utils/user-to-dto';
import type { AdminOrdersQuery } from '../validators/admin-orders.validators';

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
