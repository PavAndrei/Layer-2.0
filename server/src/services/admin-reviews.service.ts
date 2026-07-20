import {
  QueryFilter,
  Types,
  isObjectIdOrHexString,
} from 'mongoose';

import { ApiError } from '../exceptions/api-error';
import { Product } from '../models/products.model';
import {
  Review,
  type ReviewData,
  type ReviewDocument,
} from '../models/reviews.model';
import { User } from '../models/users.model';
import type {
  AdminReviewDto,
  AdminReviewResponse,
  AdminReviewsResponse,
  DeleteAdminReviewResponse,
  ReviewProductDto,
  UpdateAdminReviewResponse,
} from '../types/api';
import type {
  AdminReviewsQuery,
  UpdateAdminReviewBody,
} from '../validators/admin-reviews.validators';
import { reviewToDto } from '../utils/review-to-dto';

type ReviewProductSource = {
  _id: Types.ObjectId;
  img: string;
  slug: string;
  title: string;
};

type ReviewUserSource = {
  _id: Types.ObjectId;
  email: string;
  name: string;
};

const hasOwnField = <Field extends string>(
  value: Record<string, unknown>,
  field: Field,
) => Object.prototype.hasOwnProperty.call(value, field);

const getSafePagination = (query: AdminReviewsQuery) => {
  const page = Math.max(1, query.page);
  const limit = Math.min(Math.max(1, query.limit), 50);

  return {
    page,
    limit,
  };
};

const productToReviewProductDto = (
  product: ReviewProductSource,
): ReviewProductDto => ({
  _id: product._id.toString(),
  img: product.img,
  slug: product.slug,
  title: product.title,
});

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

const getAdminReviewsFilter = (
  query: AdminReviewsQuery,
): QueryFilter<ReviewData> => {
  const filter: QueryFilter<ReviewData> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.rating) {
    filter.rating = query.rating;
  }

  if (query.productId) {
    filter.productId = new Types.ObjectId(query.productId);
  }

  if (query.verifiedPurchase !== undefined) {
    filter.verifiedPurchase = query.verifiedPurchase;
  }

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {
      ...(query.dateFrom ? { $gte: query.dateFrom } : {}),
      ...(query.dateTo ? { $lte: query.dateTo } : {}),
    };
  }

  return filter;
};

const getReviewRelatedData = async (reviews: ReviewDocument[]) => {
  const productIds = reviews.map((review) => review.productId);
  const userIds = reviews.flatMap((review) =>
    review.userId ? [review.userId] : [],
  );
  const moderatorIds = reviews.flatMap((review) =>
    review.moderatedBy ? [review.moderatedBy] : [],
  );
  const [products, users, moderators] = await Promise.all([
    Product.find({ _id: { $in: productIds } }).select('_id img slug title'),
    User.find({ _id: { $in: userIds } }).select('_id email name'),
    User.find({ _id: { $in: moderatorIds } }).select('_id email name'),
  ]);

  return {
    productsById: new Map(
      products.map((product) => [
        product._id.toString(),
        productToReviewProductDto(product),
      ]),
    ),
    usersById: new Map(
      users.map((user) => [
        user._id.toString(),
        {
          email: user.email,
          name: user.name,
        },
      ]),
    ),
    moderatorsById: new Map(
      moderators.map((user) => [
        user._id.toString(),
        {
          email: user.email,
          name: user.name,
        },
      ]),
    ),
  };
};

const reviewToAdminDto = (
  review: ReviewDocument,
  relatedData: Awaited<ReturnType<typeof getReviewRelatedData>>,
): AdminReviewDto => {
  const reviewDto = reviewToDto(review);
  const user = review.userId
    ? relatedData.usersById.get(review.userId.toString())
    : null;
  const moderator = review.moderatedBy
    ? relatedData.moderatorsById.get(review.moderatedBy.toString())
    : null;

  return {
    ...reviewDto,
    authorEmail: user?.email,
    moderationReason: review.moderationReason ?? undefined,
    moderatedAt: review.moderatedAt?.toISOString() ?? null,
    moderatedBy: review.moderatedBy?.toString(),
    moderatedByEmail: moderator?.email,
    moderatedByName: moderator?.name,
    product: relatedData.productsById.get(review.productId.toString()) ?? null,
  };
};

const findAdminReviewById = async (reviewId: string) => {
  if (!isObjectIdOrHexString(reviewId)) {
    throw ApiError.BadRequest('Invalid review id');
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw ApiError.NotFound('Review not found');
  }

  return review;
};

export const getAdminReviewsData = async (
  query: AdminReviewsQuery,
): Promise<AdminReviewsResponse['data']> => {
  const { page, limit } = getSafePagination(query);
  const filter = getAdminReviewsFilter(query);
  const total = await Review.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);
  const relatedData = await getReviewRelatedData(reviews);

  return {
    reviews: reviews.map((review) => reviewToAdminDto(review, relatedData)),
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
    },
  };
};

export const getAdminReviewData = async (
  reviewId: string,
): Promise<AdminReviewResponse['data']> => {
  const review = await findAdminReviewById(reviewId);
  const relatedData = await getReviewRelatedData([review]);

  return {
    review: reviewToAdminDto(review, relatedData),
  };
};

export const updateAdminReviewData = async ({
  adminUserId,
  reviewId,
  update,
}: {
  adminUserId: string;
  reviewId: string;
  update: UpdateAdminReviewBody;
}): Promise<UpdateAdminReviewResponse['data']> => {
  const review = await findAdminReviewById(reviewId);
  const previousStatus = review.status;

  if (update.status !== undefined) {
    review.status = update.status;
  }

  if (hasOwnField(update, 'moderationReason')) {
    review.moderationReason = update.moderationReason;
  }

  review.moderatedAt = new Date();
  review.moderatedBy = new Types.ObjectId(adminUserId);

  await review.save();

  if (previousStatus !== review.status) {
    await recalculateProductRating(review.productId);
  }

  const relatedData = await getReviewRelatedData([review]);

  return {
    review: reviewToAdminDto(review, relatedData),
  };
};

export const deleteAdminReviewData = async (
  reviewId: string,
): Promise<DeleteAdminReviewResponse['data']> => {
  const review = await findAdminReviewById(reviewId);
  const productId = review.productId;

  await review.deleteOne();
  await recalculateProductRating(productId);

  return {
    productId: productId.toString(),
    reviewId,
  };
};
