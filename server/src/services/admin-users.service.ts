import { PipelineStage, QueryFilter, Types } from 'mongoose';

import { Order } from '../models/orders.model';
import { User, type UserData } from '../models/users.model';
import type { AdminUserListItemDto, AdminUsersResponse } from '../types/api';
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

const adminUserToListItemDto = (
  user: AdminUserAggregateResult,
): AdminUserListItemDto => {
  const isBlocked = Boolean(user.isBlocked);

  return {
    _id: user._id.toString(),
    authProviders: getUserAuthProviders(user.authProviders),
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    isBlocked,
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    ordersCount: user.ordersCount ?? 0,
    role: user.role,
    status: isBlocked ? 'blocked' : 'active',
    totalSpent: Number((user.totalSpent ?? 0).toFixed(2)),
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
