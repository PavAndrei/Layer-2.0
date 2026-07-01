import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { bootstrapAuth } from '../api';
import { useAuthStore } from './auth-store';

const AUTH_BOOTSTRAP_QUERY_KEY = ['auth', 'bootstrap'] as const;

export const useAuthBootstrap = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);
  const bootstrapQuery = useQuery({
    queryKey: AUTH_BOOTSTRAP_QUERY_KEY,
    queryFn: bootstrapAuth,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (bootstrapQuery.isPending) {
      setStatus('loading');
      return;
    }

    if (bootstrapQuery.isError || !bootstrapQuery.data?.success) {
      clearSession();
      return;
    }

    if (bootstrapQuery.data.data.isAuthenticated) {
      setSession(bootstrapQuery.data.data);
      return;
    }

    clearSession();
  }, [
    bootstrapQuery.data,
    bootstrapQuery.isError,
    bootstrapQuery.isPending,
    clearSession,
    setSession,
    setStatus,
  ]);
};
