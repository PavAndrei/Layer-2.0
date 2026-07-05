import { Button, FeedbackMessage } from '../../../shared/ui';

type ProfileEmailVerificationProps = {
  error?: string | null;
  isEmailVerified: boolean;
  isPending: boolean;
  isSuccess: boolean;
  onRequest: () => void;
};

export const ProfileEmailVerification = ({
  error,
  isEmailVerified,
  isPending,
  isSuccess,
  onRequest,
}: ProfileEmailVerificationProps) => {
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
          disabled={isPending}
          size="sm"
          variant="secondary"
          onClick={onRequest}
        >
          {isPending ? 'Sending...' : 'Send verification email'}
        </Button>
      }
    />
  );
};
