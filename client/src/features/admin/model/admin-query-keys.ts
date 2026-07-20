export const adminQueryKeys = {
  all: ['admin'] as const,
  me: () => [...adminQueryKeys.all, 'me'] as const,
};
