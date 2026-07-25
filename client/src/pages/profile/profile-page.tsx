import {
  FeedbackMessage,
  SectionedPageHeader,
  SectionedPageLayout,
  SideNavigation,
  Skeleton,
} from '../../shared/ui';
import {
  PROFILE_NAV_ITEMS,
} from '../../features/profile';
import { useProfilePage } from './model';
import {
  ProfileDetailsSection,
  ProfileOrdersSection,
  ProfileReviewsSection,
  ProfileSecuritySection,
} from './ui';

const PROFILE_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Profile' },
];

const PROFILE_PAGE_TITLE = 'Profile';
const PROFILE_PAGE_DESCRIPTION = 'Manage your Layer account details.';

export const ProfilePage = () => {
  const {
    activeSection,
    emailVerification,
    ordersSection,
    profileQuery,
    reviewsSection,
  } = useProfilePage();
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
