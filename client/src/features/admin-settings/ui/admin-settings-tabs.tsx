import { Button } from '../../../shared/ui';
import {
  ADMIN_SETTINGS_SECTION_LABELS,
  ADMIN_SETTINGS_SECTIONS,
  type AdminSettingsSection,
} from '../model';

type AdminSettingsTabsProps = {
  activeSection: AdminSettingsSection;
  onSectionChange: (section: AdminSettingsSection) => void;
};

export const AdminSettingsTabs = ({
  activeSection,
  onSectionChange,
}: AdminSettingsTabsProps) => (
  <div className="flex overflow-x-auto pb-3 sm:pb-0">
    <div
      className="inline-flex min-w-max rounded border border-border-soft bg-background-surface p-1"
      role="tablist"
      aria-label="Settings sections"
    >
      {ADMIN_SETTINGS_SECTIONS.map((section) => {
        const isActive = activeSection === section;

        return (
          <Button
            key={section}
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            role="tab"
            aria-selected={isActive}
            className="min-h-9"
            onClick={() => onSectionChange(section)}
          >
            {ADMIN_SETTINGS_SECTION_LABELS[section]}
          </Button>
        );
      })}
    </div>
  </div>
);
