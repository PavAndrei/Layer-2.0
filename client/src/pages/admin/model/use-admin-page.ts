import { useMemo } from 'react';

import { useScrollToTopOnChange } from '../../../shared/hooks';
import { useAdminPageState } from '../../../features/admin';
import { useAdminDashboardSection } from './use-admin-dashboard-section';
import { useAdminOrdersSection } from './use-admin-orders-section';
import { useAdminProductsSection } from './use-admin-products-section';
import { useAdminReviewsSection } from './use-admin-reviews-section';
import { useAdminSettingsSection } from './use-admin-settings-section';
import { useAdminUsersSection } from './use-admin-users-section';

export const useAdminPage = () => {
  const { activeSection } = useAdminPageState();
  const adminDashboardSection = useAdminDashboardSection({ activeSection });
  const adminOrdersSection = useAdminOrdersSection({ activeSection });
  const adminProductsSection = useAdminProductsSection({ activeSection });
  const adminReviewsSection = useAdminReviewsSection({ activeSection });
  const adminSettingsSection = useAdminSettingsSection({ activeSection });
  const adminUsersSection = useAdminUsersSection({ activeSection });
  const scrollDependency = useMemo(() => {
    if (activeSection === 'orders') {
      const {
        page,
        paymentStatus,
        search,
        status,
        userId,
      } = adminOrdersSection.filters.debouncedFilters;

      return [
        activeSection,
        page,
        paymentStatus,
        search,
        status,
        userId,
      ].join(':');
    }

    if (activeSection === 'reviews') {
      const {
        page,
        rating,
        search,
        userId,
        verifiedPurchase,
      } = adminReviewsSection.filters.debouncedFilters;

      return [
        activeSection,
        page,
        rating,
        search,
        userId,
        verifiedPurchase,
      ].join(':');
    }

    if (activeSection === 'products') {
      const {
        audience,
        category,
        color,
        discount,
        page,
        search,
        size,
        sort,
        status,
        stock,
      } = adminProductsSection.filters.debouncedFilters;

      return [
        activeSection,
        audience,
        category,
        color,
        discount,
        page,
        search,
        size,
        sort,
        status,
        stock,
      ].join(':');
    }

    if (activeSection === 'users') {
      const {
        isEmailVerified,
        page,
        provider,
        role,
        search,
        sort,
        status,
      } = adminUsersSection.filters.debouncedFilters;

      return [
        activeSection,
        isEmailVerified,
        page,
        provider,
        role,
        search,
        sort,
        status,
      ].join(':');
    }

    if (activeSection === 'dashboard') {
      return [
        activeSection,
        adminDashboardSection.periodState.period,
      ].join(':');
    }

    if (activeSection === 'settings') {
      return [
        activeSection,
        adminSettingsSection.activeSettingsSection,
      ].join(':');
    }

    return activeSection;
  }, [
    activeSection,
    adminDashboardSection.periodState.period,
    adminOrdersSection.filters.debouncedFilters,
    adminProductsSection.filters.debouncedFilters,
    adminReviewsSection.filters.debouncedFilters,
    adminSettingsSection.activeSettingsSection,
    adminUsersSection.filters.debouncedFilters,
  ]);

  useScrollToTopOnChange(scrollDependency, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return {
    activeSection,
    adminDashboardSection,
    adminOrdersSection,
    adminProductsSection,
    adminReviewsSection,
    adminSettingsSection,
    adminUsersSection,
  };
};
