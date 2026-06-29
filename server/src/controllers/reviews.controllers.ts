import { Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import type { ProductReviewsResponse } from '../types/api';
import { reviewToDto } from '../utils/review-to-dto';

const DEFAULT_REVIEWS_LIMIT = 5;
const MAX_REVIEWS_LIMIT = 20;

const readPositiveInteger = (
  value: unknown,
  defaultValue: number,
  maxValue?: number,
) => {
  if (typeof value !== 'string') return defaultValue;

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return maxValue ? Math.min(parsedValue, maxValue) : parsedValue;
};

export const getProductReviews = async (
  req: Request,
  res: Response<ProductReviewsResponse>,
) => {
  const { id } = req.params;

  if (!isObjectIdOrHexString(id)) {
    throw ApiError.BadRequest('Invalid product id');
  }

  const productExists = await Product.exists({ _id: id });

  if (!productExists) {
    throw ApiError.NotFound('Product not found');
  }

  const requestedPage = readPositiveInteger(req.query.page, 1);
  const limit = readPositiveInteger(
    req.query.limit,
    DEFAULT_REVIEWS_LIMIT,
    MAX_REVIEWS_LIMIT,
  );
  const filter = {
    productId: id,
    status: 'approved',
  } as const;

  const [total, ratingSummary] = await Promise.all([
    Review.countDocuments(filter),
    Review.aggregate<{ averageRating: number }>([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]),
  ]);
  const totalPages = Math.ceil(total / limit);
  const page = Math.min(requestedPage, totalPages || 1);
  const averageRating = ratingSummary[0]?.averageRating ?? 0;
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    message: 'Product reviews fetched successfully',
    success: true,
    data: {
      reviews: reviews.map(reviewToDto),
      summary: {
        count: total,
        averageRating: Number(averageRating.toFixed(1)),
      },
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    },
  });
};
