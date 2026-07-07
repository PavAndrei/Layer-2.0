import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';

import { loginWithGoogle } from '../api';
import { setAuthenticatedAuthBootstrapQueryData } from './auth-query-cache';
import type { GoogleLoginPayload } from './auth-types';
import { useAuthStore } from './auth-store';

type UseGoogleLoginOptions = {
  redirectTo?: string;
};

type RedirectLocationState = {
  from?: {
    hash?: string;
    pathname?: string;
    search?: string;
  };
};

const getRedirectPathFromState = (state: unknown): string | null => {
  const redirectState = state as RedirectLocationState | null;
  const from = redirectState?.from;

  if (!from?.pathname) return null;

  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
};

export const useGoogleLogin = ({
  redirectTo = '/profile',
}: UseGoogleLoginOptions = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const googleLoginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (response) => {
      if (!response.success) {
        setError(response.message);
        return;
      }

      setSession(response.data);
      setAuthenticatedAuthBootstrapQueryData(queryClient, response.data);
      navigate(getRedirectPathFromState(location.state) ?? redirectTo, {
        replace: true,
      });
    },
    onError: () => {
      setError('Failed to login with Google');
    },
  });

  const { isPending, mutate } = googleLoginMutation;

  const loginWithGoogleCode = useCallback(
    (payload: GoogleLoginPayload) => {
      if (isPending) return;

      setError(null);
      mutate(payload);
    },
    [isPending, mutate],
  );

  return {
    error,
    isPending,
    loginWithGoogleCode,
  };
};
