import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import type {
  StoreOrderSettings,
} from '../../../entities/store-settings';
import type {
  AdminOrderSettingsFormValues,
  UpdateAdminOrderSettingsPayload,
} from './admin-settings-types';
import { useUpdateAdminOrderSettings } from './use-update-admin-order-settings';

const EMPTY_ORDER_SETTINGS_FORM_VALUES: AdminOrderSettingsFormValues = {
  ordersEnabled: true,
  requireVerifiedEmailForCheckout: false,
};

const toFormValues = (
  orderSettings?: StoreOrderSettings | null,
): AdminOrderSettingsFormValues => ({
  ordersEnabled: orderSettings?.ordersEnabled ?? true,
  requireVerifiedEmailForCheckout:
    orderSettings?.requireVerifiedEmailForCheckout ?? false,
});

const getUpdatePayload = (
  values: AdminOrderSettingsFormValues,
  initialValues: AdminOrderSettingsFormValues,
): UpdateAdminOrderSettingsPayload => {
  const payload: UpdateAdminOrderSettingsPayload = {};

  if (values.ordersEnabled !== initialValues.ordersEnabled) {
    payload.ordersEnabled = values.ordersEnabled;
  }

  if (
    values.requireVerifiedEmailForCheckout !==
    initialValues.requireVerifiedEmailForCheckout
  ) {
    payload.requireVerifiedEmailForCheckout =
      values.requireVerifiedEmailForCheckout;
  }

  return payload;
};

const hasPayloadChanges = (payload: UpdateAdminOrderSettingsPayload) =>
  Object.keys(payload).length > 0;

export const useAdminOrderSettingsForm = (
  orderSettings?: StoreOrderSettings | null,
) => {
  const updateMutation = useUpdateAdminOrderSettings();
  const resetUpdateMutation = updateMutation.reset;
  const [initialValues, setInitialValues] =
    useState<AdminOrderSettingsFormValues>(
      EMPTY_ORDER_SETTINGS_FORM_VALUES,
    );
  const [values, setValues] = useState<AdminOrderSettingsFormValues>(
    EMPTY_ORDER_SETTINGS_FORM_VALUES,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const payload = useMemo(
    () => getUpdatePayload(values, initialValues),
    [initialValues, values],
  );
  const hasChanges = hasPayloadChanges(payload);
  const updateField = <Field extends keyof AdminOrderSettingsFormValues>(
    field: Field,
    value: AdminOrderSettingsFormValues[Field],
  ) => {
    setSuccessMessage(null);
    updateMutation.reset();
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };
  const resetForm = () => {
    setValues(initialValues);
    setSuccessMessage(null);
    updateMutation.reset();
  };
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage(null);
    updateMutation.reset();

    if (!hasChanges) return;

    updateMutation.mutate(payload, {
      onSuccess: (response) => {
        if (!response.success) return;

        const nextValues = toFormValues(response.data.settings.orders);

        setInitialValues(nextValues);
        setValues(nextValues);
        setSuccessMessage('Order settings saved.');
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
    if (!orderSettings) return;

    const nextValues = toFormValues(orderSettings);

    setInitialValues(nextValues);
    setValues(nextValues);
    setSuccessMessage(null);
    resetUpdateMutation();
  }, [
    orderSettings,
    resetUpdateMutation,
  ]);

  return {
    error,
    hasChanges,
    isSubmitting: updateMutation.isPending,
    resetForm,
    submitForm,
    successMessage,
    updateField,
    values,
  };
};
