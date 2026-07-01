export const FAVORITES_STALE_TIME_MS = 1000 * 60 * 5;

export const favoritesQueryKeys = {
  all: ['favorites'] as const,
  list: () => [...favoritesQueryKeys.all, 'list'] as const,
};
