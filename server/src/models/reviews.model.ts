import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

import { REVIEW_STATUSES, type ReviewStatus } from '../types/review';

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: 'approved' satisfies ReviewStatus,
      index: true,
    },

    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index(
  { productId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $exists: true } },
  },
);

export type ReviewData = InferSchemaType<typeof reviewSchema>;
export type ReviewDocument = HydratedDocument<ReviewData>;

export const Review = model<ReviewData>('Review', reviewSchema);
