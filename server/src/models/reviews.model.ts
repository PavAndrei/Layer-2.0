import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from 'mongoose';

import { REVIEW_STATUSES, type ReviewStatus } from '../types/review';

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
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
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

export type ReviewData = InferSchemaType<typeof reviewSchema>;
export type ReviewDocument = HydratedDocument<
  Omit<ReviewData, 'productId'> & { productId: Types.ObjectId }
>;

export const Review = model<ReviewData>('Review', reviewSchema);
