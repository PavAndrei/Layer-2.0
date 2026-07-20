import { SideNavigation } from '../../../shared/ui';
import {
  PROFILE_NAV_ITEMS,
  type ProfileSection,
} from '../model';

type ProfileSidebarProps = {
  activeSection: ProfileSection;
};

export const ProfileSidebar = ({
  activeSection,
}: ProfileSidebarProps) => {
  return (
    <SideNavigation
      activeItemId={activeSection}
      ariaLabel="Account sections"
      items={PROFILE_NAV_ITEMS}
    />
  );
};
