import type { FormEvent } from 'react';

import type { FieldErrors } from '../../../shared/lib';
import {
  Button,
  FeedbackMessage,
  TextInput,
} from '../../../shared/ui';
import type { AdminGeneralSettingsFormValues } from '../model';

type AdminGeneralSettingsFormProps = {
  error: string | null;
  fieldErrors: FieldErrors<AdminGeneralSettingsFormValues>;
  hasChanges: boolean;
  isSubmitting: boolean;
  successMessage: string | null;
  values: AdminGeneralSettingsFormValues;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: (
    field: keyof AdminGeneralSettingsFormValues,
    value: string,
  ) => void;
};

export const AdminGeneralSettingsForm = ({
  error,
  fieldErrors,
  hasChanges,
  isSubmitting,
  onReset,
  onSubmit,
  onValueChange,
  successMessage,
  values,
}: AdminGeneralSettingsFormProps) => (
  <form
    className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
    noValidate
    onSubmit={onSubmit}
  >
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">
        General settings
      </h3>
      <p className="block-small text-typography-secondary">
        Manage the public store identity and support contact details.
      </p>
    </div>

    {error && (
      <FeedbackMessage
        tone="danger"
        title="Settings could not be saved"
        description={error}
      />
    )}

    {successMessage && (
      <FeedbackMessage title="Settings saved" description={successMessage} />
    )}

    <div className="grid gap-4 sm:grid-cols-2">
      <TextInput
        required
        id="admin-store-name"
        label="Store name"
        error={fieldErrors.storeName}
        value={values.storeName}
        onChange={(value) => onValueChange('storeName', value)}
      />

      <TextInput
        required
        id="admin-support-email"
        label="Support email"
        type="email"
        error={fieldErrors.supportEmail}
        value={values.supportEmail}
        onChange={(value) => onValueChange('supportEmail', value)}
      />
    </div>

    <TextInput
      id="admin-support-phone"
      label="Support phone"
      type="tel"
      error={fieldErrors.supportPhone}
      value={values.supportPhone}
      onChange={(value) => onValueChange('supportPhone', value)}
    />

    <div className="flex flex-col gap-2">
      <label
        className="block-medium text-typography-heading"
        htmlFor="admin-store-address"
      >
        Address
      </label>
      <textarea
        id="admin-store-address"
        className={`min-h-28 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          fieldErrors.address ? 'border-red-600' : 'border-border-strong'
        }`}
        aria-describedby={
          fieldErrors.address ? 'admin-store-address-error' : undefined
        }
        aria-invalid={Boolean(fieldErrors.address)}
        value={values.address}
        onChange={(event) => onValueChange('address', event.target.value)}
      />
      {fieldErrors.address && (
        <p
          id="admin-store-address-error"
          className="block-small text-red-600"
        >
          {fieldErrors.address}
        </p>
      )}
    </div>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <Button
        className="w-full sm:w-fit"
        disabled={isSubmitting || !hasChanges}
        variant="secondary"
        onClick={onReset}
      >
        Reset
      </Button>
      <Button
        className="w-full sm:w-fit"
        disabled={isSubmitting || !hasChanges}
        type="submit"
        variant="primary"
      >
        {isSubmitting ? 'Saving...' : 'Save settings'}
      </Button>
    </div>
  </form>
);
