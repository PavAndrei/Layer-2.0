export const ADMIN_SETTINGS_SECTIONS = [
  'general',
  'shipping',
  'orders',
  'storefront',
] as const;

export type AdminSettingsSection =
  (typeof ADMIN_SETTINGS_SECTIONS)[number];

export const DEFAULT_ADMIN_SETTINGS_SECTION: AdminSettingsSection =
  'general';

export const ADMIN_SETTINGS_SECTION_LABELS: Record<
  AdminSettingsSection,
  string
> = {
  general: 'General',
  orders: 'Orders',
  shipping: 'Shipping',
  storefront: 'Storefront',
};
