import { useCallback, useState } from 'react';

export const useHeaderMobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  return {
    closeMobileMenu,
    isMobileMenuOpen,
    openMobileMenu,
  };
};
