import { Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import {
  createProductReviewData,
  getProductReviewStatusData,
} from '../services/reviews.service';
import type {
  CreateProductReviewResponse,
  ProductReviewStatusResponse,
  ProductReviewsResponse,
} from '../types/api';
import { reviewToDto } from '../utils/review-to-dto';
import type {
  CreateProductReviewBody,
  ProductReviewsParams,
  ProductReviewsQuery,
} from '../validators/reviews.validators';

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user) {
    throw ApiError.Unauthorized();
  }

  return req.user.userId;
};

export const getProductReviews = async (
  req: Request,
  res: Response<ProductReviewsResponse>,
) => {
  const { productId } = req.validated?.params as ProductReviewsParams;
  const { limit, page: requestedPage } =
    req.validated?.query as ProductReviewsQuery;

  const productExists = await Product.exists({ _id: productId });

  if (!productExists) {
    throw ApiError.NotFound('Product not found');
  }

  const filter = {
    productId,
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

export const createProductReview = async (
  req: Request,
  res: Response<CreateProductReviewResponse>,
) => {
  const { productId } = req.validated?.params as ProductReviewsParams;
  const reviewData = req.validated?.body as CreateProductReviewBody;
  const data = await createProductReviewData(
    getAuthenticatedUserId(req),
    productId,
    reviewData,
  );

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data,
  });
};

export const getProductReviewStatus = async (
  req: Request,
  res: Response<ProductReviewStatusResponse>,
) => {
  const { productId } = req.validated?.params as ProductReviewsParams;
  const data = await getProductReviewStatusData(
    getAuthenticatedUserId(req),
    productId,
  );

  res.status(200).json({
    success: true,
    message: 'Product review status fetched successfully',
    data,
  });
};
