import type { ReactNode } from 'react';

import { Breadcrumbs } from '../../../shared/ui';
import type { ProfileSection } from '../model';
import { ProfileSidebar } from './profile-sidebar';

type ProfileLayoutProps = {
  children: ReactNode;
};

const PROFILE_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Profile' },
];

export const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-4 pb-4">
        <Breadcrumbs items={PROFILE_BREADCRUMBS} />

        <div className="flex flex-col gap-2">
          <h1 className="heading text-typography-heading">Profile</h1>
          <p className="description text-typography-secondary">
            Manage your Layer account details.
          </p>
        </div>
      </div>

      {children}
    </main>
  );
};

type ProfileContentLayoutProps = {
  activeSection: ProfileSection;
  children: ReactNode;
};

export const ProfileContentLayout = ({
  activeSection,
  children,
}: ProfileContentLayoutProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ProfileSidebar activeSection={activeSection} />
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </div>
  );
};
