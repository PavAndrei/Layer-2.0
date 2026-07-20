import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import type { AdminMeResponse } from '../types/api';
import { userToDto } from '../utils/user-to-dto';

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
