import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';

import { FeedbackMessage, Skeleton } from '../../shared/ui';
import { PROFILE_QUERY_KEYS } from '../profile';
import { useConfirmEmailVerification } from './model';

const linkClassName =
  'inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const token = searchParams.get('token')?.trim() ?? '';
  const confirmEmailVerification = useConfirmEmailVerification();
  const submittedTokenRef = useRef<string | null>(null);
  const response = confirmEmailVerification.data;
  const responseError =
    response && !response.success ? response.message : null;
  const mutationError =
    confirmEmailVerification.error instanceof Error
      ? confirmEmailVerification.error.message
      : confirmEmailVerification.error
        ? 'Email verification failed'
        : null;

  useEffect(() => {
    if (!token || submittedTokenRef.current === token) return;

    submittedTokenRef.current = token;
    confirmEmailVerification.mutate(
      {
        token,
      },
      {
        onSuccess: (response) => {
          if (!response.success) return;

          queryClient.invalidateQueries({
            queryKey: PROFILE_QUERY_KEYS.profile,
          });
        },
      },
    );
  }, [confirmEmailVerification, queryClient, token]);

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-2">
        <h1 className="heading text-typography-heading">Verify email</h1>
        <p className="description text-typography-secondary">
          Confirm your email address to finish securing your Layer account.
        </p>
      </div>

      {!token && (
        <FeedbackMessage
          tone="danger"
          title="Verification link is invalid"
          description="Open the latest verification link from your email or request a new one from your profile."
          action={
            <Link to="/profile" className={linkClassName}>
              Go to profile
            </Link>
          }
        />
      )}

      {token && confirmEmailVerification.isPending && (
        <div aria-live="polite">
          <Skeleton className="h-36 w-full" />
        </div>
      )}

      {token && response?.success && (
        <FeedbackMessage
          title="Email verified"
          description="Your email address has been verified successfully."
          action={
            <Link to="/profile" className={linkClassName}>
              Go to profile
            </Link>
          }
        />
      )}

      {token && (responseError || mutationError) && (
        <FeedbackMessage
          tone="danger"
          title="Could not verify email"
          description={responseError ?? mutationError}
          action={
            <Link to="/profile" className={linkClassName}>
              Request a new link
            </Link>
          }
        />
      )}
    </main>
  );
};
