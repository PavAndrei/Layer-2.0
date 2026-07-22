export const adminSettingsQueryKeys = {
  all: ['admin-settings'] as const,
  detail: () => [...adminSettingsQueryKeys.all, 'detail'] as const,
};
