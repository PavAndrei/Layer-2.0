import { Order } from '../models/orders.model';
import { Review } from '../models/reviews.model';
import { User } from '../models/users.model';
import {
  ORDER_STATUSES,
  type OrderStatus,
} from '../types/order';
import type { AdminDashboardResponse } from '../types/api';
import {
  adminUserToListItemDto,
  type AdminUserListItemSource,
} from '../utils/admin-user-to-dto';
import {
  getAdminReviewRelatedData,
  reviewToAdminDto,
} from '../utils/admin-review-to-dto';
import { orderToAdminListItemDto } from '../utils/order-to-dto';
import type { AdminDashboardQuery } from '../validators/admin-dashboard.validators';

const RECENT_DASHBOARD_ITEMS_LIMIT = 5;

const periodDays: Record<AdminDashboardQuery['period'], number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

type RevenueSummaryAggregateResult = {
  _id: null;
  paidOrdersCount: number;
  revenue: number;
};

type RevenueSeriesAggregateResult = {
  _id: string;
  revenue: number;
};

type OrderStatusDistributionAggregateResult = {
  _id: OrderStatus;
  count: number;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getUtcDayStart = (date: Date) => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
};

const addUtcDays = (date: Date, days: number) => {
  const nextDate = new Date(date);

  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
};

const formatUtcDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getDashboardDateRange = (period: AdminDashboardQuery['period']) => {
  const days = periodDays[period];
  const todayStart = getUtcDayStart(new Date());
  const fromDate = addUtcDays(todayStart, -(days - 1));
  const dates = Array.from({ length: days }, (_, index) =>
    formatUtcDateKey(addUtcDays(fromDate, index)),
  );

  return {
    dates,
    fromDate,
  };
};

const getSummary = async (fromDate: Date) => {
  const [orders, newCustomers, revenueSummary] = await Promise.all([
    Order.countDocuments({
      createdAt: {
        $gte: fromDate,
      },
    }),
    User.countDocuments({
      createdAt: {
        $gte: fromDate,
      },
    }),
    Order.aggregate<RevenueSummaryAggregateResult>([
      {
        $match: {
          createdAt: {
            $gte: fromDate,
          },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: null,
          paidOrdersCount: {
            $sum: 1,
          },
          revenue: {
            $sum: '$total',
          },
        },
      },
    ]),
  ]);
  const paidSummary = revenueSummary[0];
  const revenue = roundMoney(paidSummary?.revenue ?? 0);
  const paidOrdersCount = paidSummary?.paidOrdersCount ?? 0;

  return {
    averageOrderValue:
      paidOrdersCount > 0 ? roundMoney(revenue / paidOrdersCount) : 0,
    newCustomers,
    orders,
    revenue,
  };
};

const getRevenueSeries = async (fromDate: Date, dates: string[]) => {
  const revenueSeries = await Order.aggregate<RevenueSeriesAggregateResult>([
    {
      $match: {
        createdAt: {
          $gte: fromDate,
        },
        paymentStatus: 'paid',
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: '$createdAt',
            format: '%Y-%m-%d',
            timezone: 'UTC',
          },
        },
        revenue: {
          $sum: '$total',
        },
      },
    },
  ]);
  const revenueByDate = new Map(
    revenueSeries.map((item) => [item._id, roundMoney(item.revenue)]),
  );

  return dates.map((date) => ({
    date,
    revenue: revenueByDate.get(date) ?? 0,
  }));
};

const getOrderStatusDistribution = async (fromDate: Date) => {
  const distribution =
    await Order.aggregate<OrderStatusDistributionAggregateResult>([
      {
        $match: {
          createdAt: {
            $gte: fromDate,
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  const countsByStatus = new Map(
    distribution.map((item) => [item._id, item.count]),
  );

  return ORDER_STATUSES.map((status) => ({
    count: countsByStatus.get(status) ?? 0,
    status,
  }));
};

const getRecentOrders = async () => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(RECENT_DASHBOARD_ITEMS_LIMIT);

  return orders.map(orderToAdminListItemDto);
};

const getRecentReviews = async () => {
  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .limit(RECENT_DASHBOARD_ITEMS_LIMIT);
  const relatedData = await getAdminReviewRelatedData(reviews);

  return reviews.map((review) => reviewToAdminDto(review, relatedData));
};

const getRecentUsers = async () => {
  const users = await User.aggregate<AdminUserListItemSource>([
    {
      $sort: {
        createdAt: -1,
        _id: -1,
      },
    },
    {
      $limit: RECENT_DASHBOARD_ITEMS_LIMIT,
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
      $project: {
        orderStats: 0,
        passwordHash: 0,
        googleId: 0,
        __v: 0,
      },
    },
  ]);

  return users.map(adminUserToListItemDto);
};

export const getAdminDashboardData = async (
  query: AdminDashboardQuery,
): Promise<AdminDashboardResponse['data']> => {
  const { dates, fromDate } = getDashboardDateRange(query.period);
  const [
    summary,
    revenueSeries,
    orderStatusDistribution,
    recentOrders,
    recentReviews,
    recentUsers,
  ] = await Promise.all([
    getSummary(fromDate),
    getRevenueSeries(fromDate, dates),
    getOrderStatusDistribution(fromDate),
    getRecentOrders(),
    getRecentReviews(),
    getRecentUsers(),
  ]);

  return {
    dashboard: {
      orderStatusDistribution,
      period: query.period,
      recentOrders,
      recentReviews,
      recentUsers,
      revenueSeries,
      summary,
    },
  };
};
