export const storeSettingsQueryKeys = {
  all: ['store-settings'] as const,
  detail: () => [...storeSettingsQueryKeys.all, 'detail'] as const,
};
