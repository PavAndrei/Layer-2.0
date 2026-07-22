import {
  ADMIN_SETTINGS_SECTION_LABELS,
  AdminGeneralSettingsForm,
  AdminShippingSettingsForm,
  AdminSettingsPlaceholderPanel,
  AdminSettingsTabs,
} from '../admin-settings';
import {
  FeedbackMessage,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import type { AdminSettingsSectionState } from './use-admin-settings-section';

const AdminSettingsSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-11 w-full max-w-xl" />
    <Skeleton className="h-96 w-full" />
  </div>
);

export const AdminSettingsSection = ({
  activeSettingsSection,
  generalForm,
  onSettingsSectionChange,
  settingsQuery,
  shippingForm,
}: AdminSettingsSectionState) => {
  const settings = settingsQuery.settings;
  const isWaitingForInitialSettings =
    !settings && settingsQuery.isLoading;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Settings"
        description="Manage store configuration and operational defaults."
      />

      <AdminSettingsTabs
        activeSection={activeSettingsSection}
        onSectionChange={onSettingsSectionChange}
      />

      {isWaitingForInitialSettings && <AdminSettingsSkeleton />}

      {!isWaitingForInitialSettings && settingsQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Settings are unavailable"
          description={settingsQuery.error}
        />
      )}

      {!isWaitingForInitialSettings &&
        !settingsQuery.error &&
        settings &&
        activeSettingsSection === 'general' && (
          <AdminGeneralSettingsForm
            error={generalForm.error}
            fieldErrors={generalForm.fieldErrors}
            hasChanges={generalForm.hasChanges}
            isSubmitting={generalForm.isSubmitting}
            successMessage={generalForm.successMessage}
            values={generalForm.values}
            onReset={generalForm.resetForm}
            onSubmit={generalForm.submitForm}
            onValueChange={generalForm.updateField}
          />
        )}

      {!isWaitingForInitialSettings &&
        !settingsQuery.error &&
        settings &&
        activeSettingsSection === 'shipping' && (
          <AdminShippingSettingsForm
            error={shippingForm.error}
            fieldErrors={shippingForm.fieldErrors}
            hasChanges={shippingForm.hasChanges}
            isSubmitting={shippingForm.isSubmitting}
            successMessage={shippingForm.successMessage}
            values={shippingForm.values}
            onReset={shippingForm.resetForm}
            onSubmit={shippingForm.submitForm}
            onValueChange={shippingForm.updateField}
          />
        )}

      {!isWaitingForInitialSettings &&
        !settingsQuery.error &&
        activeSettingsSection !== 'general' &&
        activeSettingsSection !== 'shipping' && (
          <AdminSettingsPlaceholderPanel
            title={ADMIN_SETTINGS_SECTION_LABELS[activeSettingsSection]}
            description="This settings section is prepared and will be connected next."
          />
        )}
    </section>
  );
};
