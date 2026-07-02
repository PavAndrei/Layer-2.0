import { Router } from 'express';

import { validateCart } from '../controllers/cart.controllers';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import { validateCartSchema } from '../validators/cart.validators';

const cartRoute = Router();

cartRoute.post(
  '/validate',
  validateRequest(validateCartSchema),
  catchErrors(validateCart),
);

export default cartRoute;
