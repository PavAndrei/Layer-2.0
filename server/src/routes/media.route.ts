import { Router } from 'express';

import { getImageKitAuth } from '../controllers/media.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rate-limit.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import { createImageKitUploadAuthSchema } from '../validators/media.validators';

const mediaRoute = Router();
const IMAGEKIT_AUTH_RATE_LIMIT_WINDOW_MS = 60 * 1000;

const imageKitAuthRateLimit = rateLimit({
  keyPrefix: 'imagekit-auth',
  maxRequests: 30,
  windowMs: IMAGEKIT_AUTH_RATE_LIMIT_WINDOW_MS,
});

mediaRoute.post(
  '/imagekit-auth',
  imageKitAuthRateLimit,
  authMiddleware,
  validateRequest(createImageKitUploadAuthSchema),
  catchErrors(getImageKitAuth),
);

export default mediaRoute;
