import { useEffect, useState } from 'react';

import { useRequestEmailVerification } from '../auth';

const EMAIL_VERIFICATION_COOLDOWN_SECONDS = 60;

export const useProfileEmailVerification = () => {
  const [resendAvailableInSeconds, setResendAvailableInSeconds] =
    useState(0);
  const emailVerificationMutation = useRequestEmailVerification();
  const response = emailVerificationMutation.data;
  const responseError =
    response && !response.success ? response.message : null;
  const mutationError =
    emailVerificationMutation.error instanceof Error
      ? emailVerificationMutation.error.message
      : emailVerificationMutation.error
        ? 'Failed to send verification email'
        : null;

  useEffect(() => {
    if (resendAvailableInSeconds <= 0) return;

    const timeoutId = window.setTimeout(() => {
      setResendAvailableInSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendAvailableInSeconds]);

  useEffect(() => {
    if (!response) return;

    setResendAvailableInSeconds(EMAIL_VERIFICATION_COOLDOWN_SECONDS);
  }, [response]);

  const requestEmailVerification = () => {
    if (resendAvailableInSeconds > 0) return;

    emailVerificationMutation.mutate();
  };

  return {
    error: responseError ?? mutationError,
    isPending: emailVerificationMutation.isPending,
    isSuccess: Boolean(response?.success),
    requestEmailVerification,
    resendAvailableInSeconds,
  };
};
