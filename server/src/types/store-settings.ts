export const STORE_SETTINGS_SINGLETON_KEY = 'store' as const;

export type StoreSettingsSingletonKey =
  typeof STORE_SETTINGS_SINGLETON_KEY;

export const STORE_SHIPPING_REGIONS = [
  'domestic',
  'worldwide',
] as const;

export type StoreShippingRegion =
  (typeof STORE_SHIPPING_REGIONS)[number];
