import { Router } from 'express';

import {
  getProductByIdentifier,
  getProducts,
} from '../controllers/products.controllers';
import { getProductReviews } from '../controllers/reviews.controllers';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  getProductsSchema,
  productParamsSchema,
} from '../validators/products.validators';
import { productReviewsSchema } from '../validators/reviews.validators';

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
productsRoute.get(
  '/:identifier',
  validateRequest(productParamsSchema),
  catchErrors(getProductByIdentifier),
);

export default productsRoute;
