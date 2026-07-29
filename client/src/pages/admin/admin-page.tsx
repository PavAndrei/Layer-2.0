import {
  SectionHeader,
  SectionedPageHeader,
  SectionedPageLayout,
  SideNavigation,
} from '../../shared/ui';
import {
  ADMIN_NAV_ITEMS,
  ADMIN_SECTION_LABELS,
} from '../../features/admin';
import { useAdminPage } from './model';
import {
  AdminDashboardSection,
  AdminOrdersSection,
  AdminProductsSection,
  AdminReviewsSection,
  AdminSettingsSection,
  AdminUsersSection,
} from './ui';

const ADMIN_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin' },
];

const ADMIN_PAGE_TITLE = 'Admin';
const ADMIN_PAGE_DESCRIPTION =
  'Manage store content, orders, reviews, and customers.';

export const AdminPage = () => {
  const {
    activeSection,
    adminDashboardSection,
    adminOrdersSection,
    adminProductsSection,
    adminReviewsSection,
    adminSettingsSection,
    adminUsersSection,
  } = useAdminPage();
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

  return (
    <SectionedPageLayout header={adminHeader} sidebar={adminSidebar}>
      {activeSection === 'orders' ? (
        <AdminOrdersSection {...adminOrdersSection} />
      ) : activeSection === 'products' ? (
        <AdminProductsSection {...adminProductsSection} />
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
