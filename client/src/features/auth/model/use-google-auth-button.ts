import { useCallback, useEffect, useState } from 'react';

import {
  loadGoogleIdentityService,
  requestGoogleAuthorizationCode,
} from './google-identity-service';
import { useGoogleLogin } from './use-google-login';

type UseGoogleAuthButtonOptions = {
  redirectTo?: string;
};

export const useGoogleAuthButton = ({
  redirectTo,
}: UseGoogleAuthButtonOptions = {}) => {
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const {
    error: googleLoginError,
    isPending,
    loginWithGoogleCode,
  } = useGoogleLogin({ redirectTo });
  const error = scriptError ?? googleLoginError;

  useEffect(() => {
    let isMounted = true;

    setScriptError(null);

    loadGoogleIdentityService()
      .then(() => {
        if (!isMounted) return;

        setIsScriptReady(true);
      })
      .catch(() => {
        if (!isMounted) return;

        setScriptError('Failed to load Google sign in');
        setIsScriptReady(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const requestGoogleLogin = useCallback(() => {
    if (!isScriptReady || isPending) return;

    setScriptError(null);

    requestGoogleAuthorizationCode(
      (code) => {
        loginWithGoogleCode({ code });
      },
      () => {
        setScriptError('Google sign in was cancelled');
      },
    ).catch(() => {
      setScriptError('Failed to start Google sign in');
    });
  }, [isPending, isScriptReady, loginWithGoogleCode]);

  return {
    error,
    isReady: isScriptReady,
    isPending,
    requestGoogleLogin,
  };
};
