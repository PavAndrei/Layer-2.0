import { PipelineStage, QueryFilter, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { AuthSession } from '../models/auth-sessions.model';
import { Order } from '../models/orders.model';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import {
  User,
  type UserData,
  type UserDocument,
} from '../models/users.model';
import type {
  AdminUserDto,
  AdminUserListItemDto,
  AdminUserRecentOrderDto,
  AdminUserRecentReviewDto,
  AdminUserResponse,
  AdminUsersResponse,
  ReviewProductDto,
} from '../types/api';
import type { UserAuthProvider } from '../types/user';
import { orderToAdminUserRecentOrderDto } from '../utils/order-to-dto';
import { reviewProductToDto } from '../utils/review-product-to-dto';
import { createAuditLog } from './audit-logs.service';
import type {
  AdminUsersQuery,
  UpdateAdminUserBody,
} from '../validators/admin-users.validators';

type AdminUserAggregateResult = {
  _id: Types.ObjectId;
  authProviders?: UserAuthProvider[];
  avatarUrl?: string;
  createdAt: Date;
  email: string;
  isBlocked?: boolean;
  isEmailVerified: boolean;
  name: string;
  ordersCount?: number;
  role: AdminUserListItemDto['role'];
  totalSpent?: number;
  updatedAt: Date;
};

type OrderStatsAggregateResult = {
  _id: null;
  lastOrderAt: Date | null;
  totalSpent: number;
};

const RECENT_USER_ORDERS_LIMIT = 5;
const RECENT_USER_REVIEWS_LIMIT = 5;

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSafePagination = (query: AdminUsersQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const getAdminUsersFilter = (
  query: AdminUsersQuery,
): QueryFilter<UserData> => {
  const filter: QueryFilter<UserData> = {};

  if (query.search) {
    const escapedSearch = escapeRegExp(query.search);
    const searchExpression = {
      $regex: escapedSearch,
      $options: 'i',
    };

    filter.$or = [
      { email: searchExpression },
      { name: searchExpression },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.provider) {
    filter.authProviders = query.provider;
  }

  if (query.isEmailVerified !== undefined) {
    filter.isEmailVerified = query.isEmailVerified;
  }

  if (query.status) {
    filter.isBlocked =
      query.status === 'blocked'
        ? true
        : {
          $ne: true,
        };
  }

  return filter;
};

const getAdminUsersSort = (
  sort: AdminUsersQuery['sort'],
): PipelineStage.Sort['$sort'] => {
  if (sort === 'oldest') {
    return {
      createdAt: 1,
      _id: 1,
    };
  }

  if (sort === 'most-orders') {
    return {
      ordersCount: -1,
      createdAt: -1,
      _id: -1,
    };
  }

  if (sort === 'most-spent') {
    return {
      totalSpent: -1,
      createdAt: -1,
      _id: -1,
    };
  }

  return {
    createdAt: -1,
    _id: -1,
  };
};

const getUserAuthProviders = (
  providers: UserAuthProvider[] | undefined,
): UserAuthProvider[] => {
  if (providers?.length) {
    return providers;
  }

  return ['password'];
};

const getUserStatus = (isBlocked: boolean) =>
  isBlocked ? 'blocked' : 'active';

const adminUserToListItemDto = (
  user: AdminUserAggregateResult,
): AdminUserListItemDto => {
  const isBlocked = Boolean(user.isBlocked);

  return {
    _id: user._id.toString(),
    authProviders: getUserAuthProviders(user.authProviders),
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    isBlocked,
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    ordersCount: user.ordersCount ?? 0,
    role: user.role,
    status: getUserStatus(isBlocked),
    totalSpent: Number((user.totalSpent ?? 0).toFixed(2)),
    updatedAt: user.updatedAt.toISOString(),
  };
};

const getAdminUserRecentOrders = async (
  userId: Types.ObjectId,
): Promise<AdminUserRecentOrderDto[]> => {
  const orders = await Order.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(RECENT_USER_ORDERS_LIMIT)
    .select('createdAt paymentStatus status total');

  return orders.map(orderToAdminUserRecentOrderDto);
};

const getAdminUserRecentReviews = async (
  userId: Types.ObjectId,
): Promise<AdminUserRecentReviewDto[]> => {
  const reviews = await Review.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(RECENT_USER_REVIEWS_LIMIT)
    .select('createdAt productId rating status text title');
  const productIds = reviews.map((review) => review.productId);
  const products = await Product.find({
    _id: {
      $in: productIds,
    },
  }).select('_id img slug title');
  const productsById = new Map<string, ReviewProductDto>(
    products.map((product) => [
      product._id.toString(),
      reviewProductToDto(product),
    ]),
  );

  return reviews.map((review) => ({
    _id: review._id.toString(),
    createdAt: review.createdAt.toISOString(),
    product: productsById.get(review.productId.toString()) ?? null,
    rating: review.rating,
    status: review.status,
    text: review.text,
    title: review.title,
  }));
};

const getAdminUserStats = async (userId: Types.ObjectId) => {
  const now = new Date();
  const [activeSessionsCount, lastSession, reviewsCount, orderStats] =
    await Promise.all([
      AuthSession.countDocuments({
        userId,
        revokedAt: {
          $exists: false,
        },
        expiresAt: {
          $gt: now,
        },
      }),
      AuthSession.findOne({
        userId,
      })
        .sort({ createdAt: -1 })
        .select('createdAt'),
      Review.countDocuments({
        userId,
      }),
      Order.aggregate<OrderStatsAggregateResult>([
        {
          $match: {
            userId,
          },
        },
        {
          $group: {
            _id: null,
            lastOrderAt: {
              $max: '$createdAt',
            },
            totalSpent: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$paymentStatus', 'paid'],
                  },
                  '$total',
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);
  const summary = orderStats[0];

  return {
    lastLoginAt: lastSession?.createdAt.toISOString() ?? null,
    stats: {
      activeSessionsCount,
      lastOrderAt: summary?.lastOrderAt?.toISOString() ?? null,
      reviewsCount,
      totalSpent: Number((summary?.totalSpent ?? 0).toFixed(2)),
    },
  };
};

const adminUserToDto = async (
  user: UserDocument,
): Promise<AdminUserDto> => {
  const isBlocked = Boolean(user.isBlocked);
  const [{ lastLoginAt, stats }, recentOrders, recentReviews] =
    await Promise.all([
    getAdminUserStats(user._id),
    getAdminUserRecentOrders(user._id),
    getAdminUserRecentReviews(user._id),
  ]);

  return {
    _id: user._id.toString(),
    authProviders: getUserAuthProviders(user.authProviders),
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    isBlocked,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt,
    name: user.name,
    recentOrders,
    recentReviews,
    role: user.role,
    stats,
    status: getUserStatus(isBlocked),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const getAdminUsersData = async (
  query: AdminUsersQuery,
): Promise<AdminUsersResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminUsersFilter(query);
  const total = await User.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const users = await User.aggregate<AdminUserAggregateResult>([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: Order.collection.name,
        let: {
          userId: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$userId', '$$userId'],
              },
            },
          },
          {
            $group: {
              _id: null,
              ordersCount: {
                $sum: 1,
              },
              totalSpent: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$paymentStatus', 'paid'],
                    },
                    '$total',
                    0,
                  ],
                },
              },
            },
          },
        ],
        as: 'orderStats',
      },
    },
    {
      $addFields: {
        ordersCount: {
          $ifNull: [
            {
              $arrayElemAt: ['$orderStats.ordersCount', 0],
            },
            0,
          ],
        },
        totalSpent: {
          $ifNull: [
            {
              $arrayElemAt: ['$orderStats.totalSpent', 0],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: getAdminUsersSort(query.sort),
    },
    {
      $skip: (safePage - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        orderStats: 0,
        passwordHash: 0,
        googleId: 0,
        __v: 0,
      },
    },
  ]);

  return {
    users: users.map(adminUserToListItemDto),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
};

export const getAdminUserData = async (
  userId: string,
): Promise<AdminUserResponse['data']> => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  return {
    user: await adminUserToDto(user),
  };
};

const revokeActiveAuthSessionsForUser = async (userId: Types.ObjectId) => {
  await AuthSession.updateMany(
    {
      userId,
      revokedAt: { $exists: false },
    },
    {
      revokedAt: new Date(),
    },
  );
};

export const updateAdminUserData = async ({
  adminUserId,
  update,
  userId,
}: {
  adminUserId: string;
  update: UpdateAdminUserBody;
  userId: string;
}): Promise<AdminUserResponse['data']> => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  if (update.isBlocked === true && adminUserId === user._id.toString()) {
    throw ApiError.BadRequest('Admin cannot block their own account');
  }

  if (update.role !== undefined && adminUserId === user._id.toString()) {
    throw ApiError.BadRequest('Admin cannot change their own role');
  }

  const shouldRevokeSessions =
    update.isBlocked === true ||
    (update.role !== undefined && update.role !== user.role);
  const previousIsBlocked = Boolean(user.isBlocked);
  const previousRole = user.role;

  if (Object.hasOwn(update, 'isBlocked')) {
    user.isBlocked = Boolean(update.isBlocked);
  }

  if (update.role !== undefined) {
    user.role = update.role;
  }

  await user.save();

  if (shouldRevokeSessions) {
    await revokeActiveAuthSessionsForUser(user._id);
  }

  const auditLogs = [];

  if (
    Object.hasOwn(update, 'isBlocked') &&
    previousIsBlocked !== Boolean(user.isBlocked)
  ) {
    auditLogs.push(
      createAuditLog({
        action: user.isBlocked ? 'user.blocked' : 'user.unblocked',
        actorId: adminUserId,
        entityId: user._id,
        entityType: 'user',
        metadata: {
          isBlocked: user.isBlocked,
          previousIsBlocked,
        },
      }),
    );
  }

  if (update.role !== undefined && previousRole !== user.role) {
    auditLogs.push(
      createAuditLog({
        action: 'user.role_changed',
        actorId: adminUserId,
        entityId: user._id,
        entityType: 'user',
        metadata: {
          previousRole,
          role: user.role,
        },
      }),
    );
  }

  if (auditLogs.length > 0) {
    await Promise.all(auditLogs);
  }

  return {
    user: await adminUserToDto(user),
  };
};

export const revokeAdminUserSessionsData = async ({
  adminUserId,
  userId,
}: {
  adminUserId: string;
  userId: string;
}): Promise<AdminUserResponse['data']> => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.NotFound('User not found');
  }

  if (adminUserId === user._id.toString()) {
    throw ApiError.BadRequest('Admin cannot revoke their own sessions');
  }

  await revokeActiveAuthSessionsForUser(user._id);
  await createAuditLog({
    action: 'user.sessions_revoked',
    actorId: adminUserId,
    entityId: user._id,
    entityType: 'user',
    metadata: {
      source: 'admin-user-page',
    },
  });

  return {
    user: await adminUserToDto(user),
  };
};
