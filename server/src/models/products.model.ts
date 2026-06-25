import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import {
  PRODUCT_SIZES,
  type ProductVariant,
} from '../types/product-variant';
import {
  PRODUCT_AUDIENCES,
  type ProductAudience,
} from '../types/product-audience';

type ProductVariantValue = Omit<ProductVariant, '_id'>;

const productVariantSchema = new Schema<ProductVariantValue>({
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },

  size: {
    type: String,
    enum: PRODUCT_SIZES,
    required: true,
  },

  color: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Variant quantity must be an integer',
    },
  },

  image: {
    type: String,
    trim: true,
  },
});

const hasUniqueVariantSkus = (variants: ProductVariantValue[]) =>
  new Set(variants.map((variant) => variant.sku)).size === variants.length;

const hasUniqueVariantOptions = (variants: ProductVariantValue[]) =>
  new Set(
    variants.map((variant) => `${variant.size}:${variant.color}`),
  ).size === variants.length;

const hasUniqueAudiences = (audience: ProductAudience[]) =>
  new Set(audience).size === audience.length;

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

    audience: {
      type: [
        {
          type: String,
          enum: PRODUCT_AUDIENCES,
        },
      ],
      required: true,
      default: ['unisex'],
      validate: [
        {
          validator: (audience: ProductAudience[]) => audience.length > 0,
          message: 'Product must have at least one audience',
        },
        {
          validator: hasUniqueAudiences,
          message: 'Product audiences must be unique',
        },
      ],
    },

    variants: {
      type: [productVariantSchema],
      required: true,
      validate: [
        {
          validator: (variants: ProductVariantValue[]) => variants.length > 0,
          message: 'Product must have at least one variant',
        },
        {
          validator: hasUniqueVariantSkus,
          message: 'Variant SKUs must be unique within a product',
        },
        {
          validator: hasUniqueVariantOptions,
          message: 'Variant size and color combinations must be unique',
        },
      ],
    },

    hasDiscount: {
      type: Boolean,
      default: false,
    },

    isNewProduct: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  },
);

export type ProductData = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<ProductData>;

export const Product = model<ProductData>('Product', productSchema);
