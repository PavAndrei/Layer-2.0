import { Router } from 'express';

import {
  deleteAdminReview,
  getAdminOrder,
  getAdminMe,
  getAdminOrders,
  getAdminReview,
  getAdminReviews,
  getAdminUser,
  getAdminUsers,
  updateAdminOrder,
  updateAdminReview,
} from '../controllers/admin.controllers';
import {
  authMiddleware,
  requireAdmin,
  requireUser,
} from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  adminReviewParamsSchema,
  deleteAdminReviewSchema,
  getAdminReviewsSchema,
  updateAdminReviewSchema,
} from '../validators/admin-reviews.validators';
import {
  adminOrderParamsSchema,
  getAdminOrdersSchema,
  updateAdminOrderSchema,
} from '../validators/admin-orders.validators';
import {
  adminUserParamsSchema,
  getAdminUsersSchema,
} from '../validators/admin-users.validators';

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
adminRoute.get(
  '/reviews',
  validateRequest(getAdminReviewsSchema),
  catchErrors(getAdminReviews),
);
adminRoute.get(
  '/users',
  validateRequest(getAdminUsersSchema),
  catchErrors(getAdminUsers),
);
adminRoute.get(
  '/users/:userId',
  validateRequest(adminUserParamsSchema),
  catchErrors(getAdminUser),
);
adminRoute.get(
  '/reviews/:reviewId',
  validateRequest(adminReviewParamsSchema),
  catchErrors(getAdminReview),
);
adminRoute.patch(
  '/reviews/:reviewId',
  validateRequest(updateAdminReviewSchema),
  catchErrors(updateAdminReview),
);
adminRoute.delete(
  '/reviews/:reviewId',
  validateRequest(deleteAdminReviewSchema),
  catchErrors(deleteAdminReview),
);

export default adminRoute;
