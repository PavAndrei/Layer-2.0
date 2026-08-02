import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  deleteImageKitFileForUser,
  getImageKitUploadAuth,
  registerMediaAsset,
} from '../services/media.service';
import type {
  CreateMediaAssetResponse,
  DeleteImageKitFileResponse,
  ImageKitUploadAuthResponse,
} from '../types/api';
import type {
  CreateImageKitUploadAuthBody,
  CreateMediaAssetBody,
  ImageKitFileParams,
} from '../validators/media.validators';

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

export const createMediaAsset = async (
  req: Request,
  res: Response<CreateMediaAssetResponse>,
): Promise<void> => {
  if (!req.currentUser) {
    throw ApiError.Unauthorized();
  }

  const asset = await registerMediaAsset({
    asset: req.body as CreateMediaAssetBody,
    uploadedBy: req.currentUser._id,
    userRole: req.currentUser.role,
  });

  res.status(201).json({
    success: true,
    message: 'Media asset registered successfully',
    data: {
      asset,
    },
  });
};

export const deleteImageKitFileById = async (
  req: Request,
  res: Response<DeleteImageKitFileResponse>,
): Promise<void> => {
  if (!req.currentUser) {
    throw ApiError.Unauthorized();
  }

  const { fileId } = req.validated?.params as ImageKitFileParams;

  await deleteImageKitFileForUser({
    fileId,
    userId: req.currentUser._id,
    userRole: req.currentUser.role,
  });

  res.status(200).json({
    success: true,
    message: 'Image file deleted successfully',
    data: {
      fileId,
    },
  });
};
