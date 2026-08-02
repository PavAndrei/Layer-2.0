import { Router } from 'express';

import {
  createMediaAsset,
  deleteImageKitFileById,
  getImageKitAuth,
} from '../controllers/media.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rate-limit.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  createMediaAssetSchema,
  createImageKitUploadAuthSchema,
  imageKitFileParamsSchema,
} from '../validators/media.validators';

const mediaRoute = Router();
const IMAGEKIT_AUTH_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const IMAGEKIT_DELETE_RATE_LIMIT_WINDOW_MS = 60 * 1000;

const imageKitAuthRateLimit = rateLimit({
  keyPrefix: 'imagekit-auth',
  maxRequests: 30,
  windowMs: IMAGEKIT_AUTH_RATE_LIMIT_WINDOW_MS,
});
const imageKitDeleteRateLimit = rateLimit({
  keyPrefix: 'imagekit-delete',
  maxRequests: 30,
  windowMs: IMAGEKIT_DELETE_RATE_LIMIT_WINDOW_MS,
});

mediaRoute.post(
  '/imagekit-auth',
  imageKitAuthRateLimit,
  authMiddleware,
  validateRequest(createImageKitUploadAuthSchema),
  catchErrors(getImageKitAuth),
);

mediaRoute.post(
  '/assets',
  imageKitAuthRateLimit,
  authMiddleware,
  validateRequest(createMediaAssetSchema),
  catchErrors(createMediaAsset),
);

mediaRoute.delete(
  '/imagekit-files/:fileId',
  imageKitDeleteRateLimit,
  authMiddleware,
  validateRequest(imageKitFileParamsSchema),
  catchErrors(deleteImageKitFileById),
);

export default mediaRoute;
