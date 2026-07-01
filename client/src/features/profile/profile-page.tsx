import { FeedbackMessage, Skeleton } from '../../shared/ui';
import { useProfile } from './model';
import { ProfileDetails, ProfileLayout } from './ui';

export const ProfilePage = () => {
  const profileQuery = useProfile();

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
    </ProfileLayout>
  );
};
