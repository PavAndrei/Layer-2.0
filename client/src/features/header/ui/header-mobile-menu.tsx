import { MobileFullscreenDrawer } from '../../../shared/ui';
import { HeaderNav } from './header-nav';

type HeaderMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
};

export const HeaderMobileMenu = ({
  isOpen,
  onClose,
  pathname,
}: HeaderMobileMenuProps) => {
  return (
    <MobileFullscreenDrawer
      title="Menu"
      closeLabel="Close menu"
      isOpen={isOpen}
      onClose={onClose}
    >
      <HeaderNav pathname={pathname} variant="mobile" onNavigate={onClose} />
    </MobileFullscreenDrawer>
  );
};
