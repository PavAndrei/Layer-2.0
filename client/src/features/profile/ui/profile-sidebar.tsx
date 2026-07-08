import { Link } from 'react-router';

import {
  PROFILE_SECTION_LABELS,
  PROFILE_SECTIONS,
  type ProfileSection,
} from '../model';

type ProfileSidebarProps = {
  activeSection: ProfileSection;
};

export const ProfileSidebar = ({
  activeSection,
}: ProfileSidebarProps) => {
  return (
    <aside className="flex h-fit flex-col gap-2 rounded border border-border-soft bg-background-surface p-2 lg:sticky lg:top-4">
      <nav aria-label="Account sections">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {PROFILE_SECTIONS.map((section) => {
            const isActive = section === activeSection;

            return (
              <li key={section} className="shrink-0 lg:shrink">
                <Link
                  to={`/profile?section=${section}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex min-h-10 w-full items-center rounded px-3 py-2 text-left block-medium transition-colors',
                    isActive
                      ? 'bg-accent-primary text-background-surface'
                      : 'text-typography-secondary hover:bg-background-secondary hover:text-typography-primary',
                  ].join(' ')}
                >
                  {PROFILE_SECTION_LABELS[section]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
