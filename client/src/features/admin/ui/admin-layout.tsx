import type { ReactNode } from 'react';

import { Breadcrumbs } from '../../../shared/ui';
import type { AdminSection } from '../model';
import { AdminSidebar } from './admin-sidebar';

type AdminLayoutProps = {
  activeSection: AdminSection;
  children: ReactNode;
};

const ADMIN_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin' },
];

export const AdminLayout = ({
  activeSection,
  children,
}: AdminLayoutProps) => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-4 pb-4">
        <Breadcrumbs items={ADMIN_BREADCRUMBS} />

        <div className="flex flex-col gap-2">
          <h1 className="heading text-typography-heading">Admin</h1>
          <p className="description text-typography-secondary">
            Manage store content, orders, reviews, and customers.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <AdminSidebar activeSection={activeSection} />
        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </main>
  );
};
