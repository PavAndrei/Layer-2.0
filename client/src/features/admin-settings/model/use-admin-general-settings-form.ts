import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import type {
  StoreGeneralSettings,
} from '../../../entities/store-settings';
import type { FieldErrors } from '../../../shared/lib';
import {
  adminGeneralSettingsSchema,
  getAdminGeneralSettingsFieldErrors,
} from './admin-settings-validation';
import type {
  AdminGeneralSettingsFormValues,
  UpdateAdminGeneralSettingsPayload,
} from './admin-settings-types';
import { useUpdateAdminGeneralSettings } from './use-update-admin-general-settings';

const EMPTY_GENERAL_SETTINGS_FORM_VALUES: AdminGeneralSettingsFormValues = {
  address: '',
  storeName: '',
  supportEmail: '',
  supportPhone: '',
};

const toFormValues = (
  generalSettings?: StoreGeneralSettings | null,
): AdminGeneralSettingsFormValues => ({
  address: generalSettings?.address ?? '',
  storeName: generalSettings?.storeName ?? '',
  supportEmail: generalSettings?.supportEmail ?? '',
  supportPhone: generalSettings?.supportPhone ?? '',
});

const normalizeComparableValues = (
  values: AdminGeneralSettingsFormValues,
) => ({
  address: values.address.trim(),
  storeName: values.storeName.trim(),
  supportEmail: values.supportEmail.trim().toLowerCase(),
  supportPhone: values.supportPhone.trim(),
});

const getUpdatePayload = (
  values: AdminGeneralSettingsFormValues,
  initialValues: AdminGeneralSettingsFormValues,
): UpdateAdminGeneralSettingsPayload => {
  const currentValues = normalizeComparableValues(values);
  const previousValues = normalizeComparableValues(initialValues);
  const payload: UpdateAdminGeneralSettingsPayload = {};

  if (currentValues.address !== previousValues.address) {
    payload.address = currentValues.address;
  }

  if (currentValues.storeName !== previousValues.storeName) {
    payload.storeName = currentValues.storeName;
  }

  if (currentValues.supportEmail !== previousValues.supportEmail) {
    payload.supportEmail = currentValues.supportEmail;
  }

  if (currentValues.supportPhone !== previousValues.supportPhone) {
    payload.supportPhone = currentValues.supportPhone;
  }

  return payload;
};

const hasPayloadChanges = (payload: UpdateAdminGeneralSettingsPayload) =>
  Object.keys(payload).length > 0;

export const useAdminGeneralSettingsForm = (
  generalSettings?: StoreGeneralSettings | null,
) => {
  const updateMutation = useUpdateAdminGeneralSettings();
  const resetUpdateMutation = updateMutation.reset;
  const [initialValues, setInitialValues] =
    useState<AdminGeneralSettingsFormValues>(
      EMPTY_GENERAL_SETTINGS_FORM_VALUES,
    );
  const [values, setValues] = useState<AdminGeneralSettingsFormValues>(
    EMPTY_GENERAL_SETTINGS_FORM_VALUES,
  );
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors<AdminGeneralSettingsFormValues>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const payload = useMemo(
    () => getUpdatePayload(values, initialValues),
    [initialValues, values],
  );
  const hasChanges = hasPayloadChanges(payload);
  const updateField = (
    field: keyof AdminGeneralSettingsFormValues,
    value: string,
  ) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setSuccessMessage(null);
    updateMutation.reset();
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };
  const resetForm = () => {
    setValues(initialValues);
    setFieldErrors({});
    setSuccessMessage(null);
    updateMutation.reset();
  };
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage(null);
    updateMutation.reset();

    const result = adminGeneralSettingsSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors(getAdminGeneralSettingsFieldErrors(result.error));
      return;
    }

    if (!hasChanges) return;

    updateMutation.mutate(payload, {
      onSuccess: (response) => {
        if (!response.success) return;

        const nextValues = toFormValues(response.data.settings.general);

        setInitialValues(nextValues);
        setValues(nextValues);
        setFieldErrors({});
        setSuccessMessage('General settings saved.');
      },
    });
  };
  const error =
    updateMutation.data && !updateMutation.data.success
      ? updateMutation.data.message
      : updateMutation.error instanceof Error
        ? updateMutation.error.message
        : null;

  useEffect(() => {
    if (!generalSettings) return;

    const nextValues = toFormValues(generalSettings);

    setInitialValues(nextValues);
    setValues(nextValues);
    setFieldErrors({});
    setSuccessMessage(null);
    resetUpdateMutation();
  }, [
    generalSettings,
    resetUpdateMutation,
  ]);

  return {
    error,
    fieldErrors,
    hasChanges,
    isSubmitting: updateMutation.isPending,
    resetForm,
    submitForm,
    successMessage,
    updateField,
    values,
  };
};
