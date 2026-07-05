import { FeedbackMessage, Skeleton } from '../../shared/ui';
import { useProfile } from './model';
import {
  ProfileDetails,
  ProfileEmailVerification,
  ProfileLayout,
} from './ui';
import { useProfileEmailVerification } from './use-profile-email-verification';

export const ProfilePage = () => {
  const profileQuery = useProfile();
  const emailVerification = useProfileEmailVerification();

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
        error={emailVerification.error}
        isEmailVerified={profileQuery.data.data.user.isEmailVerified}
        isPending={emailVerification.isPending}
        isSuccess={emailVerification.isSuccess}
        resendAvailableInSeconds={
          emailVerification.resendAvailableInSeconds
        }
        onRequest={emailVerification.requestEmailVerification}
      />
    </ProfileLayout>
  );
};
