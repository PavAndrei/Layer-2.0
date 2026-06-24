import { Schema, model } from 'mongoose';

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
      default: 0,
    },

    discountPrice: {
      type: Number,
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

export const Product = model('Product', productSchema);
