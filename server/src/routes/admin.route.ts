import { Router } from 'express';

import {
  getAdminOrder,
  getAdminMe,
  getAdminOrders,
  updateAdminOrder,
} from '../controllers/admin.controllers';
import {
  authMiddleware,
  requireAdmin,
  requireUser,
} from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  adminOrderParamsSchema,
  getAdminOrdersSchema,
  updateAdminOrderSchema,
} from '../validators/admin-orders.validators';

const adminRoute = Router();

adminRoute.use(authMiddleware);
adminRoute.use((req, res, next) => {
  Promise.resolve(requireUser(req, res, next)).catch(next);
});
adminRoute.use(requireAdmin);

adminRoute.get('/me', catchErrors(getAdminMe));
adminRoute.get(
  '/orders',
  validateRequest(getAdminOrdersSchema),
  catchErrors(getAdminOrders),
);
adminRoute.get(
  '/orders/:orderId',
  validateRequest(adminOrderParamsSchema),
  catchErrors(getAdminOrder),
);
adminRoute.patch(
  '/orders/:orderId',
  validateRequest(updateAdminOrderSchema),
  catchErrors(updateAdminOrder),
);

export default adminRoute;
