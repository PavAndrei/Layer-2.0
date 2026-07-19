import { isObjectIdOrHexString, Types } from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Order } from '../models/orders.model';
import { Product } from '../models/products.model';
import { Review } from '../models/reviews.model';
import { User } from '../models/users.model';
import type {
  CreateProductReviewResponse,
  DeleteReviewResponse,
  ProductReviewStatusResponse,
  ReviewProductDto,
  UpdateReviewResponse,
  UserReviewsResponse,
} from '../types/api';
import type {
  CreateProductReviewBody,
  UpdateReviewBody,
  UserReviewsQuery,
} from '../validators/reviews.validators';
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

const getSafePagination = (options: UserReviewsQuery) => {
  const page = Math.max(1, options.page);
  const limit = Math.min(Math.max(1, options.limit), 50);

  return {
    page,
    limit,
  };
};

const productToReviewProductDto = (product: {
  _id: Types.ObjectId;
  img: string;
  slug: string;
  title: string;
}): ReviewProductDto => ({
  _id: product._id.toString(),
  img: product.img,
  slug: product.slug,
  title: product.title,
});

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

export const getUserReviewsData = async (
  userId: string,
  options: UserReviewsQuery,
): Promise<UserReviewsResponse['data']> => {
  if (!isObjectIdOrHexString(userId)) {
    throw ApiError.BadRequest('Invalid user id');
  }

  const userObjectId = new Types.ObjectId(userId);
  const userExists = await User.exists({ _id: userObjectId });

  if (!userExists) {
    throw ApiError.Unauthorized('User not found');
  }

  const { page, limit } = getSafePagination(options);
  const filter = {
    userId: userObjectId,
  };
  const total = await Review.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);
  const productIds = reviews.map((review) => review.productId);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    '_id img slug title',
  );
  const productById = new Map(
    products.map((product) => [
      product._id.toString(),
      productToReviewProductDto(product),
    ]),
  );

  return {
    reviews: reviews.map((review) => ({
      ...reviewToDto(review),
      product: productById.get(review.productId.toString()) ?? null,
    })),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
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

export const updateReviewData = async (
  userId: string,
  reviewId: string,
  reviewData: UpdateReviewBody,
): Promise<UpdateReviewResponse['data']> => {
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(reviewId)) {
    throw ApiError.BadRequest('Invalid review data');
  }

  const review = await Review.findOne({
    _id: new Types.ObjectId(reviewId),
    userId: new Types.ObjectId(userId),
  });

  if (!review) {
    throw ApiError.NotFound('Review not found');
  }

  if (reviewData.rating !== undefined) {
    review.rating = reviewData.rating;
  }

  if (reviewData.title !== undefined) {
    review.title = reviewData.title;
  }

  if (reviewData.text !== undefined) {
    review.text = reviewData.text;
  }

  await review.save();
  await recalculateProductRating(review.productId);

  return {
    review: reviewToDto(review),
  };
};

export const deleteReviewData = async (
  userId: string,
  reviewId: string,
): Promise<DeleteReviewResponse['data']> => {
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(reviewId)) {
    throw ApiError.BadRequest('Invalid review data');
  }

  const review = await Review.findOne({
    _id: new Types.ObjectId(reviewId),
    userId: new Types.ObjectId(userId),
  });

  if (!review) {
    throw ApiError.NotFound('Review not found');
  }

  const productId = review.productId;

  await review.deleteOne();
  await recalculateProductRating(productId);

  return {
    productId: productId.toString(),
    reviewId,
  };
};
