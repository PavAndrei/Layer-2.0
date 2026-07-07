import { Router } from 'express';

import {
  getOrderById,
  getOrders,
} from '../controllers/orders.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  getOrdersSchema,
  orderParamsSchema,
} from '../validators/orders.validators';

const ordersRoute = Router();

ordersRoute.use(authMiddleware);

ordersRoute.get(
  '/',
  validateRequest(getOrdersSchema),
  catchErrors(getOrders),
);
ordersRoute.get(
  '/:orderId',
  validateRequest(orderParamsSchema),
  catchErrors(getOrderById),
);

export default ordersRoute;
