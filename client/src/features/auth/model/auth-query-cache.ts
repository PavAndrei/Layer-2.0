import type { QueryClient } from '@tanstack/react-query';

import type { User } from '../../../entities/user';
import type { ApiResponse } from '../../../shared/api';
import type { AuthBootstrapResponseData, AuthResponseData } from './auth-types';
import { AUTH_QUERY_KEYS } from './auth-query-keys';

const GUEST_BOOTSTRAP_RESPONSE: ApiResponse<AuthBootstrapResponseData> = {
  success: true,
  message: 'Guest session',
  data: {
    accessToken: null,
    isAuthenticated: false,
    user: null,
  },
};

export const setGuestAuthBootstrapQueryData = (queryClient: QueryClient) => {
  queryClient.setQueryData(AUTH_QUERY_KEYS.bootstrap, GUEST_BOOTSTRAP_RESPONSE);
};

export const setAuthenticatedAuthBootstrapQueryData = (
  queryClient: QueryClient,
  session: AuthResponseData,
) => {
  const authenticatedBootstrapResponse: ApiResponse<AuthBootstrapResponseData> =
    {
      success: true,
      message: 'Authenticated session',
      data: {
        accessToken: session.accessToken,
        isAuthenticated: true,
        user: session.user,
      },
    };

  queryClient.setQueryData(
    AUTH_QUERY_KEYS.bootstrap,
    authenticatedBootstrapResponse,
  );
};

export const setAuthBootstrapUserQueryData = (
  queryClient: QueryClient,
  user: User,
) => {
  queryClient.setQueryData<ApiResponse<AuthBootstrapResponseData>>(
    AUTH_QUERY_KEYS.bootstrap,
    (previousData) => {
      if (!previousData?.success || !previousData.data.isAuthenticated) {
        return previousData;
      }

      return {
        ...previousData,
        data: {
          ...previousData.data,
          user,
        },
      };
    },
  );
};
