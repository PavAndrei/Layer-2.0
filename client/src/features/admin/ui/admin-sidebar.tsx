import { SideNavigation } from '../../../shared/ui';
import {
  ADMIN_NAV_ITEMS,
  type AdminSection,
} from '../model';

type AdminSidebarProps = {
  activeSection: AdminSection;
};

export const AdminSidebar = ({
  activeSection,
}: AdminSidebarProps) => {
  return (
    <SideNavigation
      activeItemId={activeSection}
      ariaLabel="Admin sections"
      items={ADMIN_NAV_ITEMS}
    />
  );
};
