import { Router } from 'express';

import {
  deleteReview,
  getUserReviews,
  updateReview,
} from '../controllers/reviews.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  deleteReviewSchema,
  getUserReviewsSchema,
  updateReviewSchema,
} from '../validators/reviews.validators';

const reviewsRoute = Router();

reviewsRoute.use(authMiddleware);

reviewsRoute.get(
  '/me',
  validateRequest(getUserReviewsSchema),
  catchErrors(getUserReviews),
);
reviewsRoute.patch(
  '/:reviewId',
  validateRequest(updateReviewSchema),
  catchErrors(updateReview),
);
reviewsRoute.delete(
  '/:reviewId',
  validateRequest(deleteReviewSchema),
  catchErrors(deleteReview),
);

export default reviewsRoute;
