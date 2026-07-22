import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from 'mongoose';

import {
  ORDER_PAYMENT_STATUSES,
  ORDER_STATUSES,
  type OrderItemSnapshot,
  type OrderPaymentStatus,
  type OrderShippingAddress,
  type OrderShippingSnapshot,
  type OrderStatus,
  type OrderStatusHistoryItem,
} from '../types/order';
import { STORE_SHIPPING_REGIONS } from '../types/store-settings';
import { PRODUCT_SIZES } from '../types/product-variant';

const orderItemSchema = new Schema<OrderItemSnapshot>(
  {
    productId: {
      type: String,
      required: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    variantId: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    size: {
      type: String,
      enum: PRODUCT_SIZES,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Order item quantity must be an integer',
      },
    },
  },
  {
    _id: false,
  },
);

const orderShippingAddressSchema = new Schema<OrderShippingAddress>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    region: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const orderShippingSnapshotSchema = new Schema<OrderShippingSnapshot>(
  {
    estimatedDeliveryDaysMax: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedDeliveryDaysMin: {
      type: Number,
      required: true,
      min: 1,
    },

    freeShippingEnabled: {
      type: Boolean,
      required: true,
    },

    freeShippingThreshold: {
      type: Number,
      min: 0,
      default: null,
    },

    shippingNotice: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingRegion: {
      type: String,
      enum: STORE_SHIPPING_REGIONS,
      required: true,
    },

    standardShippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const orderStatusHistoryItemSchema = new Schema<OrderStatusHistoryItem>(
  {
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },

    changedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    changedBy: {
      type: String,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending' satisfies OrderStatus,
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ORDER_PAYMENT_STATUSES,
      default: 'pending' satisfies OrderPaymentStatus,
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: OrderItemSnapshot[]) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    shippingAddress: {
      type: orderShippingAddressSchema,
      required: true,
    },

    shippingSnapshot: {
      type: orderShippingSnapshotSchema,
    },

    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discountTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    shippingTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    trackingNumber: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    statusHistory: {
      type: [orderStatusHistoryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre('validate', function () {
  if (this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      changedAt: this.createdAt ?? new Date(),
    });
  }
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ userId: 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1, createdAt: -1 });
orderSchema.index({ contactEmail: 1, createdAt: -1 });

export type OrderData = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderData>;

export const Order = model<OrderData>('Order', orderSchema);
