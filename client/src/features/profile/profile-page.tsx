import { FeedbackMessage, Skeleton } from '../../shared/ui';
import {
  useProfile,
  useProfilePageState,
} from './model';
import {
  ProfileContentLayout,
  ProfileLayout,
} from './ui';
import { ProfileDetailsSection } from './profile-details-section';
import { useProfileEmailVerification } from './use-profile-email-verification';
import { useProfileOrdersSection } from './use-profile-orders-section';
import { useProfileReviewsSection } from './use-profile-reviews-section';
import { ProfileOrdersSection } from './profile-orders-section';
import { ProfileReviewsSection } from './profile-reviews-section';
import { ProfileSecuritySection } from './profile-security-section';

export const ProfilePage = () => {
  const {
    activeOrderStatus,
    activeOrdersPage,
    activeReviewsPage,
    activeSection,
    handleOrdersPageChange,
    handleReviewsPageChange,
  } = useProfilePageState();
  const profileQuery = useProfile();
  const emailVerification = useProfileEmailVerification();
  const ordersSection = useProfileOrdersSection({
    activeOrderStatus,
    activeOrdersPage,
    activeSection,
    onPageChange: handleOrdersPageChange,
  });
  const reviewsSection = useProfileReviewsSection({
    activeReviewsPage,
    activeSection,
    onPageChange: handleReviewsPageChange,
  });

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
          <ProfileDetailsSection user={profileQuery.data.data.user} />
        )}

        {activeSection === 'orders' && (
          <ProfileOrdersSection {...ordersSection} />
        )}

        {activeSection === 'reviews' && (
          <ProfileReviewsSection {...reviewsSection} />
        )}

        {activeSection === 'security' && (
          <ProfileSecuritySection
            emailVerification={emailVerification}
            isEmailVerified={profileQuery.data.data.user.isEmailVerified}
          />
        )}

      </ProfileContentLayout>
    </ProfileLayout>
  );
};
