import { Router } from 'express';

import { checkout } from '../controllers/checkout.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import { checkoutSchema } from '../validators/checkout.validators';

const checkoutRoute = Router();

checkoutRoute.use(authMiddleware);

checkoutRoute.post(
  '/',
  validateRequest(checkoutSchema),
  catchErrors(checkout),
);

export default checkoutRoute;
