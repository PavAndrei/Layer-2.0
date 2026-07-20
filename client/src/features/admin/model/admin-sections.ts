export const ADMIN_SECTIONS = [
  'dashboard',
  'products',
  'orders',
  'reviews',
  'users',
  'articles',
  'settings',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const DEFAULT_ADMIN_SECTION: AdminSection = 'dashboard';

export const ADMIN_SECTION_LABELS: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  reviews: 'Reviews',
  users: 'Users',
  articles: 'Articles',
  settings: 'Settings',
};

export const ADMIN_NAV_ITEMS = ADMIN_SECTIONS.map((section) => ({
  id: section,
  label: ADMIN_SECTION_LABELS[section],
  to:
    section === DEFAULT_ADMIN_SECTION
      ? '/admin'
      : `/admin?section=${section}`,
}));

export const isAdminSection = (value: string): value is AdminSection => {
  return ADMIN_SECTIONS.some((section) => section === value);
};
