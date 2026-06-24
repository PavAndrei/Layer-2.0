import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },

    defaultPrice: {
      type: Number,
      required: true,
    },

    discountPercent: {
      type: Number,
      required: true,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    categories: [
      {
        type: String,
      },
    ],

    color: {
      type: String,
      required: true,
    },

    hasDiscount: {
      type: Boolean,
      default: false,
    },

    isNewProduct: {
      type: Boolean,
      default: false,
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export type ProductData = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<ProductData>;

export const Product = model<ProductData>('Product', productSchema);
