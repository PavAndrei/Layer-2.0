import { StoreSettings } from '../models/store-settings.model';
import type { StoreSettingsDocument } from '../models/store-settings.model';
import {
  STORE_SETTINGS_SINGLETON_KEY,
} from '../types/store-settings';
import type {
  StoreGeneralSettingsDto,
  StoreShippingSettingsDto,
  StoreSettingsDto,
  StoreSettingsResponse,
} from '../types/api';

const DEFAULT_GENERAL_SETTINGS: StoreGeneralSettingsDto = {
  storeName: 'Layer',
  supportEmail: 'support@layer.test',
};

const DEFAULT_SHIPPING_SETTINGS: StoreShippingSettingsDto = {
  estimatedDeliveryDaysMax: 7,
  estimatedDeliveryDaysMin: 3,
  freeShippingEnabled: true,
  freeShippingThreshold: 150,
  shippingNotice: 'Orders are processed within 1-2 business days.',
  shippingRegion: 'domestic',
  standardShippingPrice: 10,
};

export const getStoreSettingsDocument =
  async (): Promise<StoreSettingsDocument> => {
    const settings = await StoreSettings.findOneAndUpdate(
      {
        key: STORE_SETTINGS_SINGLETON_KEY,
      },
      {
        $setOnInsert: {
          key: STORE_SETTINGS_SINGLETON_KEY,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );

    return settings;
  };

export const storeGeneralSettingsToDto = (
  settings: StoreSettingsDocument,
): StoreGeneralSettingsDto => {
  const general = settings.general;

  return {
    address: general?.address ?? undefined,
    storeName: general?.storeName ?? DEFAULT_GENERAL_SETTINGS.storeName,
    supportEmail:
      general?.supportEmail ?? DEFAULT_GENERAL_SETTINGS.supportEmail,
    supportPhone: general?.supportPhone ?? undefined,
  };
};

export const storeShippingSettingsToDto = (
  settings: StoreSettingsDocument,
): StoreShippingSettingsDto => {
  const shipping = settings.shipping;

  return {
    estimatedDeliveryDaysMax:
      shipping?.estimatedDeliveryDaysMax ??
      DEFAULT_SHIPPING_SETTINGS.estimatedDeliveryDaysMax,
    estimatedDeliveryDaysMin:
      shipping?.estimatedDeliveryDaysMin ??
      DEFAULT_SHIPPING_SETTINGS.estimatedDeliveryDaysMin,
    freeShippingEnabled:
      shipping?.freeShippingEnabled ??
      DEFAULT_SHIPPING_SETTINGS.freeShippingEnabled,
    freeShippingThreshold:
      shipping?.freeShippingThreshold ??
      DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
    shippingNotice:
      shipping?.shippingNotice ??
      DEFAULT_SHIPPING_SETTINGS.shippingNotice,
    shippingRegion:
      shipping?.shippingRegion ?? DEFAULT_SHIPPING_SETTINGS.shippingRegion,
    standardShippingPrice:
      shipping?.standardShippingPrice ??
      DEFAULT_SHIPPING_SETTINGS.standardShippingPrice,
  };
};

export const storeSettingsToDto = (
  settings: StoreSettingsDocument,
): StoreSettingsDto => ({
  _id: settings._id.toString(),
  createdAt: settings.createdAt.toISOString(),
  general: storeGeneralSettingsToDto(settings),
  shipping: storeShippingSettingsToDto(settings),
  updatedAt: settings.updatedAt.toISOString(),
});

export const getStoreSettingsData =
  async (): Promise<StoreSettingsResponse['data']> => {
    const settings = await getStoreSettingsDocument();

    return {
      settings: storeSettingsToDto(settings),
    };
  };
