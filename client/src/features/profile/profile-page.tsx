import {
  FeedbackMessage,
  SectionedPageHeader,
  SectionedPageLayout,
  SideNavigation,
  Skeleton,
} from '../../shared/ui';
import {
  PROFILE_NAV_ITEMS,
  useProfile,
  useProfilePageState,
} from './model';
import { ProfileDetailsSection } from './profile-details-section';
import { useProfileEmailVerification } from './use-profile-email-verification';
import { useProfileOrdersSection } from './use-profile-orders-section';
import { useProfileReviewsSection } from './use-profile-reviews-section';
import { ProfileOrdersSection } from './profile-orders-section';
import { ProfileReviewsSection } from './profile-reviews-section';
import { ProfileSecuritySection } from './profile-security-section';

const PROFILE_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Profile' },
];

const PROFILE_PAGE_TITLE = 'Profile';
const PROFILE_PAGE_DESCRIPTION = 'Manage your Layer account details.';

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
  const profileSidebar = (
    <SideNavigation
      activeItemId={activeSection}
      ariaLabel="Account sections"
      items={PROFILE_NAV_ITEMS}
    />
  );
  const profileHeader = (
    <SectionedPageHeader
      breadcrumbs={PROFILE_BREADCRUMBS}
      title={PROFILE_PAGE_TITLE}
      description={PROFILE_PAGE_DESCRIPTION}
    />
  );

  if (profileQuery.isPending) {
    return (
      <SectionedPageLayout header={profileHeader} sidebar={profileSidebar}>
        <Skeleton className="h-48 w-full" />
      </SectionedPageLayout>
    );
  }

  if (profileQuery.isError || !profileQuery.data?.success) {
    return (
      <SectionedPageLayout header={profileHeader} sidebar={profileSidebar}>
        <FeedbackMessage
          tone="danger"
          title="Profile is unavailable"
          description={
            profileQuery.data?.message ??
            'Refresh the page or sign in again.'
          }
        />
      </SectionedPageLayout>
    );
  }

  return (
    <SectionedPageLayout header={profileHeader} sidebar={profileSidebar}>
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
    </SectionedPageLayout>
  );
};
