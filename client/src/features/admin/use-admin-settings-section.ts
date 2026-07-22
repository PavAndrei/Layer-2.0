import { useState } from 'react';

import {
  DEFAULT_ADMIN_SETTINGS_SECTION,
  useAdminGeneralSettingsForm,
  useAdminOrderSettingsForm,
  useAdminShippingSettingsForm,
  useAdminStoreSettings,
  type AdminSettingsSection,
} from '../admin-settings';
import type { AdminSection } from './model';

type UseAdminSettingsSectionParams = {
  activeSection: AdminSection;
};

export const useAdminSettingsSection = ({
  activeSection,
}: UseAdminSettingsSectionParams) => {
  const [activeSettingsSection, setActiveSettingsSection] =
    useState<AdminSettingsSection>(DEFAULT_ADMIN_SETTINGS_SECTION);
  const settingsQuery = useAdminStoreSettings(activeSection === 'settings');
  const generalForm = useAdminGeneralSettingsForm(
    settingsQuery.settings?.general,
  );
  const orderForm = useAdminOrderSettingsForm(
    settingsQuery.settings?.orders,
  );
  const shippingForm = useAdminShippingSettingsForm(
    settingsQuery.settings?.shipping,
  );

  return {
    activeSettingsSection,
    generalForm,
    onSettingsSectionChange: setActiveSettingsSection,
    orderForm,
    settingsQuery,
    shippingForm,
  };
};

export type AdminSettingsSectionState = ReturnType<
  typeof useAdminSettingsSection
>;
