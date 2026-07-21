export const adminUsersQueryKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUsersQueryKeys.all, 'list'] as const,
  list: (params = '') => [...adminUsersQueryKeys.lists(), params] as const,
};
