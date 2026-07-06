import { useCooldown } from '../../shared/hooks';
import { useRequestEmailVerification } from '../auth';

const EMAIL_VERIFICATION_COOLDOWN_SECONDS = 60;

export const useProfileEmailVerification = () => {
  const cooldown = useCooldown();
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

  const requestEmailVerification = () => {
    if (cooldown.isActive) return;

    emailVerificationMutation.mutate(undefined, {
      onSettled: () => {
        cooldown.start(EMAIL_VERIFICATION_COOLDOWN_SECONDS);
      },
    });
  };

  return {
    error: responseError ?? mutationError,
    isPending: emailVerificationMutation.isPending,
    isSuccess: Boolean(response?.success),
    requestEmailVerification,
    resendAvailableInSeconds: cooldown.remainingSeconds,
  };
};
