import { Router } from 'express';

import {
  getProductById,
  getProducts,
} from '../controllers/products.controllers';
import { getProductReviews } from '../controllers/reviews.controllers';
import { catchErrors } from '../utils/catch-errors';

const productsRoute = Router();

productsRoute.get('/', catchErrors(getProducts));
productsRoute.get('/:id/reviews', catchErrors(getProductReviews));
productsRoute.get('/:id', catchErrors(getProductById));

export default productsRoute;
