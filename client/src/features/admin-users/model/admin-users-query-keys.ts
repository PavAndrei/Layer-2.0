export const adminUsersQueryKeys = {
  all: ['admin-users'] as const,
  details: () => [...adminUsersQueryKeys.all, 'detail'] as const,
  detail: (userId: string) =>
    [...adminUsersQueryKeys.details(), userId] as const,
  lists: () => [...adminUsersQueryKeys.all, 'list'] as const,
  list: (params = '') => [...adminUsersQueryKeys.lists(), params] as const,
};
