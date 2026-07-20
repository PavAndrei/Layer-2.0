export const PROFILE_SECTIONS = [
  'orders',
  'reviews',
  'profile',
  'security',
] as const;

export type ProfileSection = (typeof PROFILE_SECTIONS)[number];

export const DEFAULT_PROFILE_SECTION: ProfileSection = 'profile';

export const PROFILE_SECTION_LABELS: Record<ProfileSection, string> = {
  orders: 'Orders',
  reviews: 'Reviews',
  profile: 'Profile',
  security: 'Security',
};

export const PROFILE_NAV_ITEMS = [
  {
    id: 'orders',
    label: PROFILE_SECTION_LABELS.orders,
    to: '/profile?section=orders',
  },
  {
    id: 'reviews',
    label: PROFILE_SECTION_LABELS.reviews,
    to: '/profile?section=reviews',
  },
  {
    id: 'profile',
    label: PROFILE_SECTION_LABELS.profile,
    to: '/profile?section=profile',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    to: '/favorites',
  },
  {
    id: 'security',
    label: PROFILE_SECTION_LABELS.security,
    to: '/profile?section=security',
  },
] as const;

export const isProfileSection = (value: string): value is ProfileSection => {
  return PROFILE_SECTIONS.some((section) => section === value);
};
