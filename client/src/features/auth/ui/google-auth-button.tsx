import { useGoogleAuthButton } from '../model';
import { Button } from '../../../shared/ui';

type GoogleAuthButtonProps = {
  redirectTo?: string;
};

export const GoogleAuthButton = ({ redirectTo }: GoogleAuthButtonProps) => {
  const { error, isPending, isReady, requestGoogleLogin } = useGoogleAuthButton(
    {
      redirectTo,
    },
  );
  const isDisabled = isPending || !isReady;

  return (
    <div className="w-full space-y-2">
      <Button
        className="w-full gap-2"
        disabled={isDisabled}
        variant="secondary"
        onClick={requestGoogleLogin}
      >
        <span
          className="flex size-6 items-center justify-center rounded-full bg-background-primary border border-accent-primary text-accent-primary"
          aria-hidden="true"
        >
          G
        </span>
        <span className="text-accent-primary">
          {isPending ? 'Signing in...' : 'Continue with Google'}
        </span>
      </Button>

      {error && (
        <p className="block-small text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
