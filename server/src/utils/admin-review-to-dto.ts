import { Product } from '../models/products.model';
import { type ReviewDocument } from '../models/reviews.model';
import { User } from '../models/users.model';
import type { AdminReviewDto } from '../types/api';
import { reviewProductToDto } from './review-product-to-dto';
import { reviewToDto } from './review-to-dto';

export const getAdminReviewRelatedData = async (
  reviews: ReviewDocument[],
) => {
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
        reviewProductToDto(product),
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

export const reviewToAdminDto = (
  review: ReviewDocument,
  relatedData: Awaited<ReturnType<typeof getAdminReviewRelatedData>>,
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
    authorId: review.userId?.toString(),
    authorEmail: user?.email,
    moderationReason: review.moderationReason ?? undefined,
    moderatedAt: review.moderatedAt?.toISOString() ?? null,
    moderatedBy: review.moderatedBy?.toString(),
    moderatedByEmail: moderator?.email,
    moderatedByName: moderator?.name,
    product: relatedData.productsById.get(review.productId.toString()) ?? null,
  };
};
