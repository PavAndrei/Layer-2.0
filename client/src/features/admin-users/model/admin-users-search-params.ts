import type { AdminUsersParams } from '../api';

export const toAdminUsersSearchParams = (params: AdminUsersParams) => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.role) {
    searchParams.set('role', params.role);
  }

  if (params.provider) {
    searchParams.set('provider', params.provider);
  }

  if (params.isEmailVerified !== undefined) {
    searchParams.set('isEmailVerified', String(params.isEmailVerified));
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  return searchParams;
};
