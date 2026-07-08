export const PROFILE_SECTIONS = [
  'orders',
  'reviews',
  'profile',
  'favorites',
  'security',
] as const;

export type ProfileSection = (typeof PROFILE_SECTIONS)[number];

export const DEFAULT_PROFILE_SECTION: ProfileSection = 'profile';

export const PROFILE_SECTION_LABELS: Record<ProfileSection, string> = {
  orders: 'Orders',
  reviews: 'Reviews',
  profile: 'Profile',
  favorites: 'Favorites',
  security: 'Security',
};

export const isProfileSection = (value: string): value is ProfileSection => {
  return PROFILE_SECTIONS.some((section) => section === value);
};
