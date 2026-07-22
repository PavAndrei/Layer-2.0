import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

import {
  STORE_SETTINGS_SINGLETON_KEY,
  type StoreSettingsSingletonKey,
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
