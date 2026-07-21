import { PipelineStage, QueryFilter, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { AuthSession } from '../models/auth-sessions.model';
import { Order } from '../models/orders.model';
import { Review } from '../models/reviews.model';
import {
  User,
  type UserData,
  type UserDocument,
} from '../models/users.model';
import type {
  AdminUserDto,
  AdminUserListItemDto,
  AdminUserResponse,
  AdminUsersResponse,
} from '../types/api';
import type { UserAuthProvider } from '../types/user';
import type { AdminUsersQuery } from '../validators/admin-users.validators';

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
  const { lastLoginAt, stats } = await getAdminUserStats(user._id);

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
