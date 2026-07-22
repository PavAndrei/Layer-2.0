import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

import {
  STORE_SETTINGS_SINGLETON_KEY,
  STORE_SHIPPING_REGIONS,
  type StoreSettingsSingletonKey,
  type StoreShippingRegion,
} from '../types/store-settings';

const storeSettingsSchema = new Schema(
  {
    key: {
      type: String,
      enum: [STORE_SETTINGS_SINGLETON_KEY],
      default: STORE_SETTINGS_SINGLETON_KEY,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },

    general: {
      storeName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
        default: 'Layer',
      },

      supportEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        default: 'support@layer.test',
      },

      supportPhone: {
        type: String,
        trim: true,
        maxlength: 40,
      },

      address: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },

    shipping: {
      estimatedDeliveryDaysMax: {
        type: Number,
        required: true,
        min: 1,
        default: 7,
      },

      estimatedDeliveryDaysMin: {
        type: Number,
        required: true,
        min: 1,
        default: 3,
      },

      freeShippingEnabled: {
        type: Boolean,
        required: true,
        default: true,
      },

      freeShippingThreshold: {
        type: Number,
        min: 0,
        default: 150,
      },

      shippingNotice: {
        type: String,
        trim: true,
        maxlength: 300,
        default: 'Orders are processed within 1-2 business days.',
      },

      shippingRegion: {
        type: String,
        enum: STORE_SHIPPING_REGIONS,
        required: true,
        default: 'domestic' satisfies StoreShippingRegion,
      },

      standardShippingPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
      },
    },

    orders: {
      ordersEnabled: {
        type: Boolean,
        required: true,
        default: true,
      },

      requireVerifiedEmailForCheckout: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

export type StoreSettingsData = Omit<
  InferSchemaType<typeof storeSettingsSchema>,
  'key'
> & {
  key: StoreSettingsSingletonKey;
};
export type StoreSettingsDocument = HydratedDocument<StoreSettingsData>;

export const StoreSettings = model<StoreSettingsData>(
  'StoreSettings',
  storeSettingsSchema,
);
