import { isObjectIdOrHexString, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Order } from '../models/orders.model';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import { User } from '../models/users.model';
import type {
  CreateProductReviewResponse,
  ProductReviewStatusResponse,
} from '../types/api';
import type { CreateProductReviewBody } from '../validators/reviews.validators';
import { reviewToDto } from '../utils/review-to-dto';

const isDuplicateKeyError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 11000;

const recalculateProductRating = async (productId: Types.ObjectId) => {
  const [summary] = await Review.aggregate<{ averageRating: number }>([
    {
      $match: {
        productId,
        status: 'approved',
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Product.updateOne(
    { _id: productId },
    { $set: { rating: Number((summary?.averageRating ?? 0).toFixed(1)) } },
  );
};

export const createProductReviewData = async (
  userId: string,
  productId: string,
  reviewData: CreateProductReviewBody,
): Promise<CreateProductReviewResponse['data']> => {
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(productId)) {
    throw ApiError.BadRequest('Invalid review data');
  }

  const userObjectId = new Types.ObjectId(userId);
  const productObjectId = new Types.ObjectId(productId);

  const [user, productExists, existingReview, purchasedOrderExists] =
    await Promise.all([
      User.findById(userObjectId).select('name'),
      Product.exists({ _id: productObjectId }),
      Review.exists({
        productId: productObjectId,
        userId: userObjectId,
      }),
      Order.exists({
        userId: userObjectId,
        status: { $ne: 'cancelled' },
        'items.productId': productObjectId.toString(),
      }),
    ]);

  if (!user) {
    throw ApiError.Unauthorized('User not found');
  }

  if (!productExists) {
    throw ApiError.NotFound('Product not found');
  }

  if (existingReview) {
    throw ApiError.Conflict('You have already reviewed this product');
  }

  const review = await Review.create({
    productId: productObjectId,
    userId: userObjectId,
    authorName: user.name,
    rating: reviewData.rating,
    title: reviewData.title,
    text: reviewData.text,
    verifiedPurchase: Boolean(purchasedOrderExists),
    status: 'approved',
  }).catch((error: unknown) => {
    if (isDuplicateKeyError(error)) {
      throw ApiError.Conflict('You have already reviewed this product');
    }

    throw error;
  });

  await recalculateProductRating(productObjectId);

  return {
    review: reviewToDto(review),
  };
};

export const getProductReviewStatusData = async (
  userId: string,
  productId: string,
): Promise<ProductReviewStatusResponse['data']> => {
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(productId)) {
    throw ApiError.BadRequest('Invalid review status data');
  }

  const userObjectId = new Types.ObjectId(userId);
  const productObjectId = new Types.ObjectId(productId);

  const [userExists, productExists, review] = await Promise.all([
    User.exists({ _id: userObjectId }),
    Product.exists({ _id: productObjectId }),
    Review.findOne({
      productId: productObjectId,
      userId: userObjectId,
    }),
  ]);

  if (!userExists) {
    throw ApiError.Unauthorized('User not found');
  }

  if (!productExists) {
    throw ApiError.NotFound('Product not found');
  }

  return {
    hasReviewed: Boolean(review),
    review: review ? reviewToDto(review) : null,
  };
};
