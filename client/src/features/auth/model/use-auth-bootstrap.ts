import { useEffect } from 'react';

import { bootstrapAuth } from '../api';
import { useAuthStore } from './auth-store';

export const useAuthBootstrap = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setStatus('loading');

      const response = await bootstrapAuth();

      if (!isMounted) return;

      if (response.success && response.data.isAuthenticated) {
        setSession(response.data);
        return;
      }

      clearSession();
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [clearSession, setSession, setStatus]);
};
