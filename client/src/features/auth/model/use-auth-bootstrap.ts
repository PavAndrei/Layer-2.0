import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { setApiAuthRefreshHandler } from '../../../shared/api';
import { bootstrapAuth, refreshAuth } from '../api';
import {
  setAuthenticatedAuthBootstrapQueryData,
  setGuestAuthBootstrapQueryData,
} from './auth-query-cache';
import { AUTH_QUERY_KEYS } from './auth-query-keys';
import { useAuthStore } from './auth-store';

export const useAuthBootstrap = () => {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);
  const bootstrapQuery = useQuery({
    queryKey: AUTH_QUERY_KEYS.bootstrap,
    queryFn: bootstrapAuth,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    setApiAuthRefreshHandler(async () => {
      try {
        const response = await refreshAuth();

        if (!response.success) {
          clearSession();
          setGuestAuthBootstrapQueryData(queryClient);
          return false;
        }

        setSession(response.data);
        setAuthenticatedAuthBootstrapQueryData(queryClient, response.data);
        return true;
      } catch {
        clearSession();
        setGuestAuthBootstrapQueryData(queryClient);
        return false;
      }
    });

    return () => setApiAuthRefreshHandler(null);
  }, [clearSession, queryClient, setSession]);

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
