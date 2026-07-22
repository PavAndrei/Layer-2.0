import { StoreSettings } from '../models/store-settings.model';
import type { StoreSettingsDocument } from '../models/store-settings.model';
import {
  STORE_SETTINGS_SINGLETON_KEY,
} from '../types/store-settings';
import type {
  StoreGeneralSettingsDto,
  StoreSettingsDto,
  StoreSettingsResponse,
} from '../types/api';

const DEFAULT_GENERAL_SETTINGS: StoreGeneralSettingsDto = {
  storeName: 'Layer',
  supportEmail: 'support@layer.test',
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

export const storeSettingsToDto = (
  settings: StoreSettingsDocument,
): StoreSettingsDto => ({
  _id: settings._id.toString(),
  createdAt: settings.createdAt.toISOString(),
  general: storeGeneralSettingsToDto(settings),
  updatedAt: settings.updatedAt.toISOString(),
});

export const getStoreSettingsData =
  async (): Promise<StoreSettingsResponse['data']> => {
    const settings = await getStoreSettingsDocument();

    return {
      settings: storeSettingsToDto(settings),
    };
  };
