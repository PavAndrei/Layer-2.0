import { QueryFilter } from 'mongoose';

import { Product, ProductData } from '../models/products.model';
import type { AdminProductsResponse } from '../types/api';
import { adminProductToListItemDto } from '../utils/admin-product-to-dto';
import type { AdminProductsQuery } from '../validators/admin-products.validators';

const LOW_STOCK_THRESHOLD = 5;

const TOTAL_STOCK_EXPRESSION = {
  $reduce: {
    input: '$variants',
    initialValue: 0,
    in: {
      $add: ['$$value', '$$this.quantity'],
    },
  },
};

type ProductStatsAggregateResult = {
  _id: null;
  active: number;
  archived: number;
  discounted: number;
  draft: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  total: number;
  totalStock: number;
  totalVariants: number;
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSafePagination = (query: AdminProductsQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const getAdminProductsFilter = (
  query: AdminProductsQuery,
): QueryFilter<ProductData> => {
  const filter: QueryFilter<ProductData> = {};

  if (query.search) {
    const escapedSearch = escapeRegExp(query.search);
    const searchExpression = {
      $regex: escapedSearch,
      $options: 'i',
    };

    filter.$or = [
      { title: searchExpression },
      { slug: searchExpression },
    ];
  }

  if (query.status) {
    if (query.status === 'active') {
      filter.$and = [
        ...(filter.$and ?? []),
        {
          $or: [
            { status: 'active' },
            { status: { $exists: false } },
          ],
        },
      ];
    } else {
      filter.status = query.status;
    }
  }

  if (query.category) {
    filter.categories = query.category;
  }

  if (query.audience) {
    filter.audience = query.audience;
  }

  if (query.hasDiscount !== undefined) {
    filter.hasDiscount = query.hasDiscount;
  }

  const variantFilter: {
    color?: string;
    quantity?: { $gt: number };
    size?: string;
  } = {};

  if (query.color) {
    variantFilter.color = query.color;
  }

  if (query.size) {
    variantFilter.size = query.size;
  }

  if (query.stock === 'in-stock') {
    variantFilter.quantity = { $gt: 0 };
  }

  if (Object.keys(variantFilter).length > 0) {
    filter.variants = {
      $elemMatch: variantFilter,
    };
  }

  if (query.stock === 'out-of-stock') {
    filter.$and = [
      ...(filter.$and ?? []),
      {
        variants: {
          $not: {
            $elemMatch: {
              quantity: { $gt: 0 },
            },
          },
        },
      },
    ];
  }

  if (query.stock === 'low-stock') {
    filter.$and = [
      ...(filter.$and ?? []),
      {
        $expr: {
          $and: [
            {
              $gt: [
                TOTAL_STOCK_EXPRESSION,
                0,
              ],
            },
            {
              $lte: [
                TOTAL_STOCK_EXPRESSION,
                LOW_STOCK_THRESHOLD,
              ],
            },
          ],
        },
      },
    ];
  }

  return filter;
};

const getAdminProductsSort = (
  sort: AdminProductsQuery['sort'],
): Record<string, 1 | -1> => {
  switch (sort) {
    case 'name-asc':
      return {
        title: 1,
        _id: 1,
      };

    case 'name-desc':
      return {
        title: -1,
        _id: -1,
      };

    case 'price-asc':
      return {
        discountPrice: 1,
        _id: 1,
      };

    case 'price-desc':
      return {
        discountPrice: -1,
        _id: -1,
      };

    case 'rating-asc':
      return {
        rating: 1,
        _id: 1,
      };

    case 'rating-desc':
      return {
        rating: -1,
        _id: -1,
      };

    default:
      return {
        updatedAt: -1,
        _id: -1,
      };
  }
};

const getAdminProductsStats = async () => {
  const [stats] = await Product.aggregate<ProductStatsAggregateResult>([
    {
      $addFields: {
        normalizedStatus: {
          $ifNull: ['$status', 'active'],
        },
        totalStock: TOTAL_STOCK_EXPRESSION,
        totalVariants: {
          $size: '$variants',
        },
      },
    },
    {
      $group: {
        _id: null,
        active: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'active'] }, 1, 0],
          },
        },
        archived: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'archived'] }, 1, 0],
          },
        },
        discounted: {
          $sum: {
            $cond: ['$hasDiscount', 1, 0],
          },
        },
        draft: {
          $sum: {
            $cond: [{ $eq: ['$normalizedStatus', 'draft'] }, 1, 0],
          },
        },
        inStock: {
          $sum: {
            $cond: [{ $gt: ['$totalStock', 0] }, 1, 0],
          },
        },
        lowStock: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gt: ['$totalStock', 0] },
                  { $lte: ['$totalStock', LOW_STOCK_THRESHOLD] },
                ],
              },
              1,
              0,
            ],
          },
        },
        outOfStock: {
          $sum: {
            $cond: [{ $lte: ['$totalStock', 0] }, 1, 0],
          },
        },
        total: {
          $sum: 1,
        },
        totalStock: {
          $sum: '$totalStock',
        },
        totalVariants: {
          $sum: '$totalVariants',
        },
      },
    },
  ]);

  return {
    active: stats?.active ?? 0,
    archived: stats?.archived ?? 0,
    discounted: stats?.discounted ?? 0,
    draft: stats?.draft ?? 0,
    inStock: stats?.inStock ?? 0,
    lowStock: stats?.lowStock ?? 0,
    outOfStock: stats?.outOfStock ?? 0,
    total: stats?.total ?? 0,
    totalStock: stats?.totalStock ?? 0,
    totalVariants: stats?.totalVariants ?? 0,
  };
};

export const getAdminProductsData = async (
  query: AdminProductsQuery,
): Promise<AdminProductsResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminProductsFilter(query);
  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const [products, stats] = await Promise.all([
    Product.find(filter)
      .sort(getAdminProductsSort(query.sort))
      .skip((safePage - 1) * limit)
      .limit(limit),
    getAdminProductsStats(),
  ]);

  return {
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
    products: products.map(adminProductToListItemDto),
    stats,
  };
};
