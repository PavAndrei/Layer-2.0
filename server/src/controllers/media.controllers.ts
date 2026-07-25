import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import { getImageKitUploadAuth } from '../services/media.service';
import type { ImageKitUploadAuthResponse } from '../types/api';
import type { CreateImageKitUploadAuthBody } from '../validators/media.validators';

export const getImageKitAuth = async (
  req: Request,
  res: Response<ImageKitUploadAuthResponse>,
): Promise<void> => {
  if (!req.currentUser) {
    throw ApiError.Unauthorized();
  }

  const { purpose } = req.body as CreateImageKitUploadAuthBody;
  const data = getImageKitUploadAuth({
    purpose,
    userId: req.currentUser._id.toString(),
    userRole: req.currentUser.role,
  });

  res.status(200).json({
    success: true,
    message: 'ImageKit upload auth generated successfully',
    data,
  });
};
