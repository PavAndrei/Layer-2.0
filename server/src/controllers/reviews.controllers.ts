import { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import type { ProductReviewsResponse } from '../types/api';
import { reviewToDto } from '../utils/review-to-dto';
import type { ProductReviewsQuery } from '../validators/reviews.validators';

export const getProductReviews = async (
  req: Request,
  res: Response<ProductReviewsResponse>,
) => {
  const { id } = req.validated?.params as { id: string };
  const { limit, page: requestedPage } =
    req.validated?.query as ProductReviewsQuery;

  const productExists = await Product.exists({ _id: id });

  if (!productExists) {
    throw ApiError.NotFound('Product not found');
  }

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
