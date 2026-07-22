import { useMemo } from 'react';

import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  SectionHeader,
  SectionedPageHeader,
  SectionedPageLayout,
  SideNavigation,
} from '../../shared/ui';
import {
  ADMIN_NAV_ITEMS,
  ADMIN_SECTION_LABELS,
  useAdminPageState,
} from './model';
import { AdminDashboardSection } from './admin-dashboard-section';
import { AdminOrdersSection } from './admin-orders-section';
import { AdminReviewsSection } from './admin-reviews-section';
import { AdminSettingsSection } from './admin-settings-section';
import { AdminUsersSection } from './admin-users-section';
import { useAdminDashboardSection } from './use-admin-dashboard-section';
import { useAdminOrdersSection } from './use-admin-orders-section';
import { useAdminReviewsSection } from './use-admin-reviews-section';
import { useAdminSettingsSection } from './use-admin-settings-section';
import { useAdminUsersSection } from './use-admin-users-section';

const ADMIN_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin' },
];

const ADMIN_PAGE_TITLE = 'Admin';
const ADMIN_PAGE_DESCRIPTION =
  'Manage store content, orders, reviews, and customers.';

export const AdminPage = () => {
  const { activeSection } = useAdminPageState();
  const adminDashboardSection = useAdminDashboardSection({ activeSection });
  const adminOrdersSection = useAdminOrdersSection({ activeSection });
  const adminReviewsSection = useAdminReviewsSection({ activeSection });
  const adminSettingsSection = useAdminSettingsSection({ activeSection });
  const adminUsersSection = useAdminUsersSection({ activeSection });
  const scrollDependency = useMemo(() => {
    if (activeSection === 'orders') {
      const {
        page,
        paymentStatus,
        search,
        status,
        userId,
      } = adminOrdersSection.filters.debouncedFilters;

      return [
        activeSection,
        page,
        paymentStatus,
        search,
        status,
        userId,
      ].join(':');
    }

    if (activeSection === 'reviews') {
      const {
        page,
        rating,
        search,
        userId,
        verifiedPurchase,
      } = adminReviewsSection.filters.debouncedFilters;

      return [
        activeSection,
        page,
        rating,
        search,
        userId,
        verifiedPurchase,
      ].join(':');
    }

    if (activeSection === 'users') {
      const {
        isEmailVerified,
        page,
        provider,
        role,
        search,
        sort,
        status,
      } = adminUsersSection.filters.debouncedFilters;

      return [
        activeSection,
        isEmailVerified,
        page,
        provider,
        role,
        search,
        sort,
        status,
      ].join(':');
    }

    if (activeSection === 'dashboard') {
      return [
        activeSection,
        adminDashboardSection.periodState.period,
      ].join(':');
    }

    if (activeSection === 'settings') {
      return [
        activeSection,
        adminSettingsSection.activeSettingsSection,
      ].join(':');
    }

    return activeSection;
  }, [
    activeSection,
    adminDashboardSection.periodState.period,
    adminOrdersSection.filters.debouncedFilters,
    adminReviewsSection.filters.debouncedFilters,
    adminSettingsSection.activeSettingsSection,
    adminUsersSection.filters.debouncedFilters,
  ]);
  const adminSidebar = (
    <SideNavigation
      activeItemId={activeSection}
      ariaLabel="Admin sections"
      items={ADMIN_NAV_ITEMS}
    />
  );
  const adminHeader = (
    <SectionedPageHeader
      breadcrumbs={ADMIN_BREADCRUMBS}
      title={ADMIN_PAGE_TITLE}
      description={ADMIN_PAGE_DESCRIPTION}
    />
  );

  useScrollToTopOnChange(scrollDependency, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return (
    <SectionedPageLayout header={adminHeader} sidebar={adminSidebar}>
      {activeSection === 'orders' ? (
        <AdminOrdersSection {...adminOrdersSection} />
      ) : activeSection === 'dashboard' ? (
        <AdminDashboardSection {...adminDashboardSection} />
      ) : activeSection === 'reviews' ? (
        <AdminReviewsSection {...adminReviewsSection} />
      ) : activeSection === 'settings' ? (
        <AdminSettingsSection {...adminSettingsSection} />
      ) : activeSection === 'users' ? (
        <AdminUsersSection {...adminUsersSection} />
      ) : (
        <section className="rounded border border-border-soft bg-background-surface p-4">
          <SectionHeader
            title={ADMIN_SECTION_LABELS[activeSection]}
            description="This admin section is prepared and will be connected next."
          />
        </section>
      )}
    </SectionedPageLayout>
  );
};
