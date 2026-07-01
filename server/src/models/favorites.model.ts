import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from 'mongoose';

const favoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, createdAt: -1 });

export type FavoriteData = InferSchemaType<typeof favoriteSchema>;
export type FavoriteDocument = HydratedDocument<
  Omit<FavoriteData, 'productId' | 'userId'> & {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
  }
>;

export const Favorite = model<FavoriteData>('Favorite', favoriteSchema);
