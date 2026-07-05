import { useRequestEmailVerification } from '../auth';
import { FeedbackMessage, Skeleton } from '../../shared/ui';
import { useProfile } from './model';
import {
  ProfileDetails,
  ProfileEmailVerification,
  ProfileLayout,
} from './ui';

export const ProfilePage = () => {
  const profileQuery = useProfile();
  const emailVerificationMutation = useRequestEmailVerification();
  const emailVerificationResponse = emailVerificationMutation.data;
  const emailVerificationResponseError =
    emailVerificationResponse && !emailVerificationResponse.success
      ? emailVerificationResponse.message
      : null;
  const emailVerificationMutationError =
    emailVerificationMutation.error instanceof Error
      ? emailVerificationMutation.error.message
      : emailVerificationMutation.error
        ? 'Failed to send verification email'
        : null;

  if (profileQuery.isPending) {
    return (
      <ProfileLayout>
        <Skeleton className="h-48 w-full" />
      </ProfileLayout>
    );
  }

  if (profileQuery.isError || !profileQuery.data?.success) {
    return (
      <ProfileLayout>
        <FeedbackMessage
          tone="danger"
          title="Profile is unavailable"
          description={
            profileQuery.data?.message ??
            'Refresh the page or sign in again.'
          }
        />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <ProfileDetails user={profileQuery.data.data.user} />
      <ProfileEmailVerification
        error={
          emailVerificationResponseError ?? emailVerificationMutationError
        }
        isEmailVerified={profileQuery.data.data.user.isEmailVerified}
        isPending={emailVerificationMutation.isPending}
        isSuccess={Boolean(emailVerificationResponse?.success)}
        onRequest={() => emailVerificationMutation.mutate()}
      />
    </ProfileLayout>
  );
};
