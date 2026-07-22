import type { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import {
  deleteAdminReviewData,
  getAdminReviewData,
  getAdminReviewsData,
  updateAdminReviewData,
} from '../services/admin-reviews.service';
import {
  getAdminOrderData,
  getAdminOrdersData,
  updateAdminOrderData,
} from '../services/admin-orders.service';
import {
  getAdminUserData,
  getAdminUsersData,
  revokeAdminUserSessionsData,
  updateAdminUserData,
} from '../services/admin-users.service';
import { getAdminDashboardData } from '../services/admin-dashboard.service';
import {
  updateAdminGeneralSettingsData,
  updateAdminShippingSettingsData,
} from '../services/admin-settings.service';
import { getStoreSettingsData } from '../services/store-settings.service';
import type {
  AdminDashboardResponse,
  AdminReviewResponse,
  AdminReviewsResponse,
  AdminMeResponse,
  AdminOrderResponse,
  AdminOrdersResponse,
  AdminStoreSettingsResponse,
  AdminUserResponse,
  AdminUsersResponse,
  DeleteAdminReviewResponse,
  UpdateAdminReviewResponse,
} from '../types/api';
import type {
  AdminDashboardQuery,
} from '../validators/admin-dashboard.validators';
import { userToDto } from '../utils/user-to-dto';
import type {
  AdminReviewParams,
  AdminReviewsQuery,
  UpdateAdminReviewBody,
} from '../validators/admin-reviews.validators';
import type {
  AdminOrderParams,
  AdminOrdersQuery,
  UpdateAdminOrderBody,
} from '../validators/admin-orders.validators';
import type {
  AdminUserParams,
  AdminUsersQuery,
  UpdateAdminUserBody,
} from '../validators/admin-users.validators';
import type {
  UpdateAdminGeneralSettingsBody,
  UpdateAdminShippingSettingsBody,
} from '../validators/admin-settings.validators';

export const getAdminMe = async (
  req: Request,
  res: Response<AdminMeResponse>,
) => {
  if (!req.currentUser) {
    throw ApiError.Unauthorized();
  }

  res.status(200).json({
    success: true,
    message: 'Admin user fetched successfully',
    data: {
      user: userToDto(req.currentUser),
    },
  });
};

export const getAdminDashboard = async (
  req: Request,
  res: Response<AdminDashboardResponse>,
) => {
  const data = await getAdminDashboardData(
    req.validated?.query as AdminDashboardQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Admin dashboard fetched successfully',
    data,
  });
};

export const getAdminStoreSettings = async (
  _req: Request,
  res: Response<AdminStoreSettingsResponse>,
) => {
  const data = await getStoreSettingsData();

  res.status(200).json({
    success: true,
    message: 'Admin store settings fetched successfully',
    data,
  });
};

export const updateAdminGeneralSettings = async (
  req: Request,
  res: Response<AdminStoreSettingsResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const body = req.validated?.body as UpdateAdminGeneralSettingsBody;
  const data = await updateAdminGeneralSettingsData({
    adminUserId: req.user.userId,
    update: body,
  });

  res.status(200).json({
    success: true,
    message: 'Admin general settings updated successfully',
    data,
  });
};

export const updateAdminShippingSettings = async (
  req: Request,
  res: Response<AdminStoreSettingsResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const body = req.validated?.body as UpdateAdminShippingSettingsBody;
  const data = await updateAdminShippingSettingsData({
    adminUserId: req.user.userId,
    update: body,
  });

  res.status(200).json({
    success: true,
    message: 'Admin shipping settings updated successfully',
    data,
  });
};

export const getAdminOrders = async (
  req: Request,
  res: Response<AdminOrdersResponse>,
) => {
  const data = await getAdminOrdersData(
    req.validated?.query as AdminOrdersQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Admin orders fetched successfully',
    data,
  });
};

export const getAdminReviews = async (
  req: Request,
  res: Response<AdminReviewsResponse>,
) => {
  const data = await getAdminReviewsData(
    req.validated?.query as AdminReviewsQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Admin reviews fetched successfully',
    data,
  });
};

export const getAdminUsers = async (
  req: Request,
  res: Response<AdminUsersResponse>,
) => {
  const data = await getAdminUsersData(
    req.validated?.query as AdminUsersQuery,
  );

  res.status(200).json({
    success: true,
    message: 'Admin users fetched successfully',
    data,
  });
};

export const getAdminUser = async (
  req: Request,
  res: Response<AdminUserResponse>,
) => {
  const { userId } = req.validated?.params as AdminUserParams;
  const data = await getAdminUserData(userId);

  res.status(200).json({
    success: true,
    message: 'Admin user fetched successfully',
    data,
  });
};

export const updateAdminUser = async (
  req: Request,
  res: Response<AdminUserResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { userId } = req.validated?.params as AdminUserParams;
  const body = req.validated?.body as UpdateAdminUserBody;
  const data = await updateAdminUserData({
    adminUserId: req.user.userId,
    update: body,
    userId,
  });

  res.status(200).json({
    success: true,
    message: 'Admin user updated successfully',
    data,
  });
};

export const revokeAdminUserSessions = async (
  req: Request,
  res: Response<AdminUserResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { userId } = req.validated?.params as AdminUserParams;
  const data = await revokeAdminUserSessionsData({
    adminUserId: req.user.userId,
    userId,
  });

  res.status(200).json({
    success: true,
    message: 'Admin user sessions revoked successfully',
    data,
  });
};

export const getAdminReview = async (
  req: Request,
  res: Response<AdminReviewResponse>,
) => {
  const { reviewId } = req.validated?.params as AdminReviewParams;
  const data = await getAdminReviewData(reviewId);

  res.status(200).json({
    success: true,
    message: 'Admin review fetched successfully',
    data,
  });
};

export const updateAdminReview = async (
  req: Request,
  res: Response<UpdateAdminReviewResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { reviewId } = req.validated?.params as AdminReviewParams;
  const body = req.validated?.body as UpdateAdminReviewBody;
  const data = await updateAdminReviewData({
    adminUserId: req.user.userId,
    reviewId,
    update: body,
  });

  res.status(200).json({
    success: true,
    message: 'Admin review updated successfully',
    data,
  });
};

export const deleteAdminReview = async (
  req: Request,
  res: Response<DeleteAdminReviewResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { reviewId } = req.validated?.params as AdminReviewParams;
  const data = await deleteAdminReviewData({
    adminUserId: req.user.userId,
    reviewId,
  });

  res.status(200).json({
    success: true,
    message: 'Admin review deleted successfully',
    data,
  });
};

export const getAdminOrder = async (
  req: Request,
  res: Response<AdminOrderResponse>,
) => {
  const { orderId } = req.validated?.params as AdminOrderParams;
  const data = await getAdminOrderData(orderId);

  res.status(200).json({
    success: true,
    message: 'Admin order fetched successfully',
    data,
  });
};

export const updateAdminOrder = async (
  req: Request,
  res: Response<AdminOrderResponse>,
) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  const { orderId } = req.validated?.params as AdminOrderParams;
  const body = req.validated?.body as UpdateAdminOrderBody;
  const data = await updateAdminOrderData({
    adminUserId: req.user.userId,
    orderId,
    update: body,
  });

  res.status(200).json({
    success: true,
    message: 'Admin order updated successfully',
    data,
  });
};
