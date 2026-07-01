import { Router } from 'express';

import {
  addFavoriteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
} from '../controllers/favorites.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import { favoriteProductParamsSchema } from '../validators/favorites.validators';

const favoritesRoute = Router();

favoritesRoute.use(authMiddleware);

favoritesRoute.get('/', catchErrors(getFavoriteProducts));
favoritesRoute.post(
  '/:productId',
  validateRequest(favoriteProductParamsSchema),
  catchErrors(addFavoriteProduct),
);
favoritesRoute.delete(
  '/:productId',
  validateRequest(favoriteProductParamsSchema),
  catchErrors(removeFavoriteProduct),
);

export default favoritesRoute;
