import { Router } from 'express';

import {
  deleteAdminReview,
  getAdminDashboard,
  getAdminOrder,
  getAdminMe,
  getAdminOrders,
  getAdminStoreSettings,
  getAdminReview,
  getAdminReviews,
  getAdminUser,
  getAdminUsers,
  revokeAdminUserSessions,
  updateAdminGeneralSettings,
  updateAdminOrderSettings,
  updateAdminShippingSettings,
  updateAdminOrder,
  updateAdminUser,
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
  updateAdminUserSchema,
} from '../validators/admin-users.validators';
import { getAdminDashboardSchema } from '../validators/admin-dashboard.validators';
import {
  updateAdminGeneralSettingsSchema,
  updateAdminOrderSettingsSchema,
  updateAdminShippingSettingsSchema,
} from '../validators/admin-settings.validators';

const adminRoute = Router();

adminRoute.use(authMiddleware);
adminRoute.use((req, res, next) => {
  Promise.resolve(requireUser(req, res, next)).catch(next);
});
adminRoute.use(requireAdmin);

adminRoute.get('/me', catchErrors(getAdminMe));
adminRoute.get(
  '/dashboard',
  validateRequest(getAdminDashboardSchema),
  catchErrors(getAdminDashboard),
);
adminRoute.get('/settings', catchErrors(getAdminStoreSettings));
adminRoute.patch(
  '/settings/general',
  validateRequest(updateAdminGeneralSettingsSchema),
  catchErrors(updateAdminGeneralSettings),
);
adminRoute.patch(
  '/settings/shipping',
  validateRequest(updateAdminShippingSettingsSchema),
  catchErrors(updateAdminShippingSettings),
);
adminRoute.patch(
  '/settings/orders',
  validateRequest(updateAdminOrderSettingsSchema),
  catchErrors(updateAdminOrderSettings),
);
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
adminRoute.patch(
  '/users/:userId',
  validateRequest(updateAdminUserSchema),
  catchErrors(updateAdminUser),
);
adminRoute.post(
  '/users/:userId/sessions/revoke',
  validateRequest(adminUserParamsSchema),
  catchErrors(revokeAdminUserSessions),
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
