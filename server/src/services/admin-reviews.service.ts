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
  AdminReviewResponse,
  AdminReviewsResponse,
  DeleteAdminReviewResponse,
  UpdateAdminReviewResponse,
} from '../types/api';
import type {
  AdminReviewsQuery,
  UpdateAdminReviewBody,
} from '../validators/admin-reviews.validators';
import { createAuditLog } from './audit-logs.service';
import {
  getAdminReviewRelatedData,
  reviewToAdminDto,
} from '../utils/admin-review-to-dto';

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  searchFilter?: QueryFilter<ReviewData>,
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

  if (query.userId) {
    filter.userId = new Types.ObjectId(query.userId);
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

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  return filter;
};

const getAdminReviewsSearchFilter = async (
  search: string | undefined,
): Promise<QueryFilter<ReviewData> | undefined> => {
  if (!search) return undefined;

  const escapedSearch = escapeRegExp(search);
  const searchExpression = {
    $regex: escapedSearch,
    $options: 'i',
  };

  const [products, users] = await Promise.all([
    Product.find({
      $or: [
        { title: searchExpression },
        { slug: searchExpression },
      ],
    }).select('_id'),
    User.find({
      $or: [
        { email: searchExpression },
        { name: searchExpression },
      ],
    }).select('_id'),
  ]);

  const productIds = products.map((product) => product._id);
  const userIds = users.map((user) => user._id);

  return {
    $or: [
      { authorName: searchExpression },
      ...(productIds.length > 0 ? [{ productId: { $in: productIds } }] : []),
      ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : []),
    ],
  };
};

const getReviewStatusAuditAction = (
  previousStatus: ReviewDocument['status'],
  nextStatus: ReviewDocument['status'],
) => {
  if (nextStatus === 'approved') {
    return previousStatus === 'rejected'
      ? 'review.restored'
      : 'review.approved';
  }

  if (nextStatus === 'rejected') {
    return 'review.hidden';
  }

  return null;
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
  const searchFilter = await getAdminReviewsSearchFilter(query.search);
  const filter = getAdminReviewsFilter(query, searchFilter);
  const total = await Review.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.min(page, totalPages || 1);
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);
  const relatedData = await getAdminReviewRelatedData(reviews);

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
  const relatedData = await getAdminReviewRelatedData([review]);

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
  const previousModerationReason = review.moderationReason;

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

  const auditLogs = [];
  const statusAuditAction = getReviewStatusAuditAction(
    previousStatus,
    review.status,
  );

  if (statusAuditAction) {
    auditLogs.push(
      createAuditLog({
        action: statusAuditAction,
        actorId: adminUserId,
        entityId: review._id,
        entityType: 'review',
        metadata: {
          previousStatus,
          productId: review.productId.toString(),
          status: review.status,
        },
      }),
    );
  }

  if (
    hasOwnField(update, 'moderationReason') &&
    previousModerationReason !== review.moderationReason
  ) {
    auditLogs.push(
      createAuditLog({
        action: 'review.moderation_reason_changed',
        actorId: adminUserId,
        entityId: review._id,
        entityType: 'review',
        metadata: {
          hasModerationReason: Boolean(review.moderationReason),
          hadModerationReason: Boolean(previousModerationReason),
          productId: review.productId.toString(),
        },
      }),
    );
  }

  if (auditLogs.length > 0) {
    await Promise.all(auditLogs);
  }

  const relatedData = await getAdminReviewRelatedData([review]);

  return {
    review: reviewToAdminDto(review, relatedData),
  };
};

export const deleteAdminReviewData = async ({
  adminUserId,
  reviewId,
}: {
  adminUserId: string;
  reviewId: string;
}): Promise<DeleteAdminReviewResponse['data']> => {
  const review = await findAdminReviewById(reviewId);
  const productId = review.productId;

  await createAuditLog({
    action: 'review.deleted',
    actorId: adminUserId,
    entityId: review._id,
    entityType: 'review',
    metadata: {
      productId: productId.toString(),
      status: review.status,
    },
  });
  await review.deleteOne();
  await recalculateProductRating(productId);

  return {
    productId: productId.toString(),
    reviewId,
  };
};
