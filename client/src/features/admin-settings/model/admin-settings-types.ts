import type {
  StoreGeneralSettings,
  StoreShippingSettings,
} from '../../../entities/store-settings';

export type UpdateAdminGeneralSettingsPayload =
  Partial<StoreGeneralSettings>;

export type UpdateAdminShippingSettingsPayload =
  Partial<StoreShippingSettings>;

export type AdminGeneralSettingsFormValues = {
  address: string;
  storeName: string;
  supportEmail: string;
  supportPhone: string;
};

export type AdminShippingSettingsFormValues = {
  estimatedDeliveryDaysMax: string;
  estimatedDeliveryDaysMin: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: string;
  shippingNotice: string;
  shippingRegion: StoreShippingSettings['shippingRegion'];
  standardShippingPrice: string;
};
