import { Router } from 'express';

import {
  getProductByIdentifier,
  getProducts,
} from '../controllers/products.controllers';
import {
  createProductReview,
  getProductReviewStatus,
  getProductReviews,
} from '../controllers/reviews.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  getProductsSchema,
  productParamsSchema,
} from '../validators/products.validators';
import {
  createProductReviewSchema,
  productReviewStatusSchema,
  productReviewsSchema,
} from '../validators/reviews.validators';

const productsRoute = Router();

productsRoute.get(
  '/',
  validateRequest(getProductsSchema),
  catchErrors(getProducts),
);
productsRoute.get(
  '/:productId/reviews',
  validateRequest(productReviewsSchema),
  catchErrors(getProductReviews),
);
productsRoute.post(
  '/:productId/reviews',
  authMiddleware,
  validateRequest(createProductReviewSchema),
  catchErrors(createProductReview),
);
productsRoute.get(
  '/:productId/review-status',
  authMiddleware,
  validateRequest(productReviewStatusSchema),
  catchErrors(getProductReviewStatus),
);
productsRoute.get(
  '/:identifier',
  validateRequest(productParamsSchema),
  catchErrors(getProductByIdentifier),
);

export default productsRoute;
