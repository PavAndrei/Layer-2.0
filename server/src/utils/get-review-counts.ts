import { Types } from 'mongoose';

import { Review } from '../models/reviews.model';

type ReviewCountAggregateResult = {
  _id: Types.ObjectId;
  count: number;
};

export const getReviewCountsByProductIds = async (
  productIds: Types.ObjectId[],
) => {
  if (productIds.length === 0) {
    return new Map<string, number>();
  }

  const reviewCounts = await Review.aggregate<ReviewCountAggregateResult>([
    {
      $match: {
        productId: { $in: productIds },
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$productId',
        count: { $sum: 1 },
      },
    },
  ]);

  return new Map(
    reviewCounts.map((reviewCount) => [
      reviewCount._id.toString(),
      reviewCount.count,
    ]),
  );
};
