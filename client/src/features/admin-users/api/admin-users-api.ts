import type {
  AdminUserListItem,
  UserAuthProvider,
  UserRole,
  UserStatus,
} from '../../../entities/user';
import { apiClient } from '../../../shared/api';
import type {
  ApiResponse,
  PaginationData,
} from '../../../shared/api';

export type AdminUserSortOption =
  | 'newest'
  | 'oldest'
  | 'most-orders'
  | 'most-spent';

export type AdminUsersParams = {
  isEmailVerified?: boolean;
  limit?: number;
  page?: number;
  provider?: UserAuthProvider;
  role?: UserRole;
  search?: string;
  sort?: AdminUserSortOption;
  status?: UserStatus;
};

export type AdminUsersResponseData = {
  pagination: PaginationData;
  users: AdminUserListItem[];
};

export const getAdminUsers = async (
  params: AdminUsersParams = {},
  signal?: AbortSignal,
): Promise<ApiResponse<AdminUsersResponseData>> => {
  return apiClient.get<AdminUsersResponseData>({
    path: '/admin/users',
    params,
    signal,
    errorMessage: 'Failed to load admin users',
  });
};
