import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import type {
  StoreShippingSettings,
} from '../../../entities/store-settings';
import type { FieldErrors } from '../../../shared/lib';
import {
  adminShippingSettingsSchema,
  getAdminShippingSettingsFieldErrors,
} from './admin-settings-validation';
import type {
  AdminShippingSettingsFormValues,
  UpdateAdminShippingSettingsPayload,
} from './admin-settings-types';
import {
  useUpdateAdminShippingSettings,
} from './use-update-admin-shipping-settings';

const EMPTY_SHIPPING_SETTINGS_FORM_VALUES: AdminShippingSettingsFormValues = {
  estimatedDeliveryDaysMax: '',
  estimatedDeliveryDaysMin: '',
  freeShippingEnabled: false,
  freeShippingThreshold: '',
  shippingNotice: '',
  shippingRegion: 'domestic',
  standardShippingPrice: '',
};

const toFormValues = (
  shippingSettings?: StoreShippingSettings | null,
): AdminShippingSettingsFormValues => ({
  estimatedDeliveryDaysMax:
    shippingSettings?.estimatedDeliveryDaysMax?.toString() ?? '',
  estimatedDeliveryDaysMin:
    shippingSettings?.estimatedDeliveryDaysMin?.toString() ?? '',
  freeShippingEnabled: shippingSettings?.freeShippingEnabled ?? false,
  freeShippingThreshold:
    shippingSettings?.freeShippingThreshold?.toString() ?? '',
  shippingNotice: shippingSettings?.shippingNotice ?? '',
  shippingRegion: shippingSettings?.shippingRegion ?? 'domestic',
  standardShippingPrice:
    shippingSettings?.standardShippingPrice?.toString() ?? '',
});

const normalizeComparableValues = (
  values: AdminShippingSettingsFormValues,
) => ({
  estimatedDeliveryDaysMax: Number(values.estimatedDeliveryDaysMax),
  estimatedDeliveryDaysMin: Number(values.estimatedDeliveryDaysMin),
  freeShippingEnabled: values.freeShippingEnabled,
  freeShippingThreshold: values.freeShippingEnabled
    ? Number(values.freeShippingThreshold)
    : null,
  shippingNotice: values.shippingNotice.trim(),
  shippingRegion: values.shippingRegion,
  standardShippingPrice: Number(values.standardShippingPrice),
});

const getUpdatePayload = (
  values: AdminShippingSettingsFormValues,
  initialValues: AdminShippingSettingsFormValues,
): UpdateAdminShippingSettingsPayload => {
  const currentValues = normalizeComparableValues(values);
  const previousValues = normalizeComparableValues(initialValues);
  const payload: UpdateAdminShippingSettingsPayload = {};

  if (
    currentValues.estimatedDeliveryDaysMax !==
    previousValues.estimatedDeliveryDaysMax
  ) {
    payload.estimatedDeliveryDaysMax =
      currentValues.estimatedDeliveryDaysMax;
  }

  if (
    currentValues.estimatedDeliveryDaysMin !==
    previousValues.estimatedDeliveryDaysMin
  ) {
    payload.estimatedDeliveryDaysMin =
      currentValues.estimatedDeliveryDaysMin;
  }

  if (
    currentValues.freeShippingEnabled !==
    previousValues.freeShippingEnabled
  ) {
    payload.freeShippingEnabled = currentValues.freeShippingEnabled;
  }

  if (
    currentValues.freeShippingThreshold !==
    previousValues.freeShippingThreshold
  ) {
    payload.freeShippingThreshold = currentValues.freeShippingThreshold;
  }

  if (currentValues.shippingNotice !== previousValues.shippingNotice) {
    payload.shippingNotice = currentValues.shippingNotice;
  }

  if (currentValues.shippingRegion !== previousValues.shippingRegion) {
    payload.shippingRegion = currentValues.shippingRegion;
  }

  if (
    currentValues.standardShippingPrice !==
    previousValues.standardShippingPrice
  ) {
    payload.standardShippingPrice = currentValues.standardShippingPrice;
  }

  return payload;
};

const hasPayloadChanges = (payload: UpdateAdminShippingSettingsPayload) =>
  Object.keys(payload).length > 0;

export const useAdminShippingSettingsForm = (
  shippingSettings?: StoreShippingSettings | null,
) => {
  const updateMutation = useUpdateAdminShippingSettings();
  const resetUpdateMutation = updateMutation.reset;
  const [initialValues, setInitialValues] =
    useState<AdminShippingSettingsFormValues>(
      EMPTY_SHIPPING_SETTINGS_FORM_VALUES,
    );
  const [values, setValues] = useState<AdminShippingSettingsFormValues>(
    EMPTY_SHIPPING_SETTINGS_FORM_VALUES,
  );
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors<AdminShippingSettingsFormValues>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const payload = useMemo(
    () => getUpdatePayload(values, initialValues),
    [initialValues, values],
  );
  const hasChanges = hasPayloadChanges(payload);
  const updateField = <
    Field extends keyof AdminShippingSettingsFormValues,
  >(
    field: Field,
    value: AdminShippingSettingsFormValues[Field],
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

    const result = adminShippingSettingsSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors(getAdminShippingSettingsFieldErrors(result.error));
      return;
    }

    if (!hasChanges) return;

    updateMutation.mutate(payload, {
      onSuccess: (response) => {
        if (!response.success) return;

        const nextValues = toFormValues(response.data.settings.shipping);

        setInitialValues(nextValues);
        setValues(nextValues);
        setFieldErrors({});
        setSuccessMessage('Shipping settings saved.');
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
    if (!shippingSettings) return;

    const nextValues = toFormValues(shippingSettings);

    setInitialValues(nextValues);
    setValues(nextValues);
    setFieldErrors({});
    setSuccessMessage(null);
    resetUpdateMutation();
  }, [
    resetUpdateMutation,
    shippingSettings,
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
