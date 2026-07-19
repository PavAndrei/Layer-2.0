import type { ReviewDocument } from '../models/reviews.model';
import type { ReviewDto } from '../types/api';

export const reviewToDto = (review: ReviewDocument): ReviewDto => ({
  _id: review._id.toString(),
  productId: review.productId.toString(),
  authorName: review.authorName,
  rating: review.rating,
  title: review.title,
  text: review.text,
  verifiedPurchase: review.verifiedPurchase,
  status: review.status,
  createdAt: review.createdAt.toISOString(),
  editedAt: review.editedAt?.toISOString() ?? null,
  updatedAt: review.updatedAt.toISOString(),
});
