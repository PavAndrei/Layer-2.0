import { Button, FeedbackMessage } from '../../../shared/ui';

type ProfileEmailVerificationProps = {
  error?: string | null;
  isEmailVerified: boolean;
  isPending: boolean;
  isSuccess: boolean;
  onRequest: () => void;
  resendAvailableInSeconds: number;
};

export const ProfileEmailVerification = ({
  error,
  isEmailVerified,
  isPending,
  isSuccess,
  onRequest,
  resendAvailableInSeconds,
}: ProfileEmailVerificationProps) => {
  const isCooldownActive = resendAvailableInSeconds > 0;
  const isActionDisabled = isPending || isCooldownActive;
  const actionLabel = isPending
    ? 'Sending...'
    : isCooldownActive
      ? `Send again in ${resendAvailableInSeconds}s`
      : isSuccess
        ? 'Send again'
        : 'Send verification email';

  if (isEmailVerified) {
    return (
      <FeedbackMessage
        title="Email verified"
        description="Your account email is confirmed."
      />
    );
  }

  return (
    <FeedbackMessage
      title="Verify your email"
      description={
        error ??
        (isSuccess
          ? 'Verification email sent. Check your inbox and open the latest link.'
          : 'Send a verification link to confirm your account email.')
      }
      tone={error ? 'danger' : 'neutral'}
      action={
        <Button
          disabled={isActionDisabled}
          size="sm"
          variant="secondary"
          onClick={onRequest}
        >
          {actionLabel}
        </Button>
      }
    />
  );
};
