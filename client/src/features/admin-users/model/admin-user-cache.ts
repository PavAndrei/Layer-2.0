import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '../../../shared/api';
import type { AdminUserResponseData } from '../api';
import { adminUsersQueryKeys } from './admin-users-query-keys';

export const syncAdminUserQueries = (
  queryClient: QueryClient,
  userId: string,
  response: ApiResponse<AdminUserResponseData>,
) => {
  queryClient.setQueryData<ApiResponse<AdminUserResponseData>>(
    adminUsersQueryKeys.detail(userId),
    response,
  );
  queryClient.invalidateQueries({
    queryKey: adminUsersQueryKeys.lists(),
  });
};
