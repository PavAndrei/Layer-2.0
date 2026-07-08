import { useSearchParams } from 'react-router';

import { FeedbackMessage, Skeleton } from '../../shared/ui';
import {
  DEFAULT_PROFILE_SECTION,
  PROFILE_SECTION_LABELS,
  isProfileSection,
  useProfile,
} from './model';
import type { ProfileSection } from './model';
import {
  ProfileContentLayout,
  ProfileDetails,
  ProfileEmailVerification,
  ProfileLayout,
  ProfileSectionHeader,
} from './ui';
import { useProfileEmailVerification } from './use-profile-email-verification';

const getProfileSectionFromSearchParams = (
  searchParams: URLSearchParams,
): ProfileSection => {
  const section = searchParams.get('section') ?? '';

  return isProfileSection(section) ? section : DEFAULT_PROFILE_SECTION;
};

const placeholderDescriptions: Record<
  Exclude<ProfileSection, 'profile' | 'security'>,
  string
> = {
  orders: 'Your order history will appear here.',
  reviews: 'Your product reviews will appear here.',
  favorites: 'Your saved products will appear here.',
};

export const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const activeSection = getProfileSectionFromSearchParams(searchParams);
  const profileQuery = useProfile();
  const emailVerification = useProfileEmailVerification();

  if (profileQuery.isPending) {
    return (
      <ProfileLayout>
        <ProfileContentLayout activeSection={activeSection}>
          <Skeleton className="h-48 w-full" />
        </ProfileContentLayout>
      </ProfileLayout>
    );
  }

  if (profileQuery.isError || !profileQuery.data?.success) {
    return (
      <ProfileLayout>
        <ProfileContentLayout activeSection={activeSection}>
          <FeedbackMessage
            tone="danger"
            title="Profile is unavailable"
            description={
              profileQuery.data?.message ??
              'Refresh the page or sign in again.'
            }
          />
        </ProfileContentLayout>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <ProfileContentLayout activeSection={activeSection}>
        {activeSection === 'profile' && (
          <>
            <ProfileSectionHeader
              title="Profile"
              description="Review your account details."
            />
            <ProfileDetails user={profileQuery.data.data.user} />
          </>
        )}

        {activeSection === 'security' && (
          <>
            <ProfileSectionHeader
              title="Security"
              description="Manage account verification and security settings."
            />
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
          </>
        )}

        {activeSection !== 'profile' && activeSection !== 'security' && (
          <>
            <ProfileSectionHeader
              title={PROFILE_SECTION_LABELS[activeSection]}
              description={placeholderDescriptions[activeSection]}
            />
            <FeedbackMessage
              title={`${PROFILE_SECTION_LABELS[activeSection]} coming soon`}
              description="This account section is prepared and will be connected next."
            />
          </>
        )}
      </ProfileContentLayout>
    </ProfileLayout>
  );
};
