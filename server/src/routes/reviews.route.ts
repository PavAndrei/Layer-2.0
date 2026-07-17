import { Router } from 'express';

import { getUserReviews } from '../controllers/reviews.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import { getUserReviewsSchema } from '../validators/reviews.validators';

const reviewsRoute = Router();

reviewsRoute.use(authMiddleware);

reviewsRoute.get(
  '/me',
  validateRequest(getUserReviewsSchema),
  catchErrors(getUserReviews),
);

export default reviewsRoute;
