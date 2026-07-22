export type StoreGeneralSettings = {
  address?: string;
  storeName: string;
  supportEmail: string;
  supportPhone?: string;
};

export const STORE_SHIPPING_REGIONS = [
  'domestic',
  'worldwide',
] as const;

export type StoreShippingRegion =
  (typeof STORE_SHIPPING_REGIONS)[number];

export type StoreShippingSettings = {
  estimatedDeliveryDaysMax: number;
  estimatedDeliveryDaysMin: number;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number | null;
  shippingNotice?: string;
  shippingRegion: StoreShippingRegion;
  standardShippingPrice: number;
};

export type StoreSettings = {
  _id: string;
  createdAt: string;
  general: StoreGeneralSettings;
  shipping: StoreShippingSettings;
  updatedAt: string;
};
