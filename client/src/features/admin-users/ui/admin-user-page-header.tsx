import type { AdminUser } from '../../../entities/user';
import { SectionedPageHeader } from '../../../shared/ui';

type AdminUserPageHeaderProps = {
  user: AdminUser | null;
};

const getAdminUserBreadcrumbs = (userName?: string) => [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' },
  { label: 'Users', to: '/admin?section=users' },
  { label: userName || 'User' },
];

export const AdminUserPageHeader = ({ user }: AdminUserPageHeaderProps) => (
  <SectionedPageHeader
    breadcrumbs={getAdminUserBreadcrumbs(user?.name)}
    title={user?.name || 'User'}
    description={
      user?.email || 'Review account details, identity data, and activity.'
    }
  />
);
