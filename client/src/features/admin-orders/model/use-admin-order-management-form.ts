import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import type { AdminOrder } from '../../../entities/order';
import { getZodFieldErrors, type FieldErrors } from '../../../shared/lib';
import {
  adminOrderManagementFormSchema,
  type AdminOrderManagementFormValues,
  type UpdateAdminOrderPayload,
} from './admin-order-validation';
import { useUpdateAdminOrder } from './use-update-admin-order';

export type AdminOrderManagementFormErrors =
  FieldErrors<AdminOrderManagementFormValues>;

const getUnknownErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : 'Failed to update order';
};

export const useAdminOrderManagementForm = (order: AdminOrder) => {
  const updateOrderMutation = useUpdateAdminOrder();
  const initialValues = useMemo(
    (): AdminOrderManagementFormValues => ({
      adminNote: order.adminNote ?? '',
      status: order.status,
      statusNote: '',
      trackingNumber: order.trackingNumber ?? '',
    }),
    [order.adminNote, order.status, order.trackingNumber],
  );
  const [values, setValues] = useState<AdminOrderManagementFormValues>(() =>
    initialValues,
  );
  const [fieldErrors, setFieldErrors] =
    useState<AdminOrderManagementFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues);
    setFieldErrors({});
    setFormError(null);
    setSuccessMessage(null);
  }, [initialValues, order._id]);

  const isSubmitting = updateOrderMutation.isPending;
  const isStatusChanged = values.status !== order.status;
  const isStatusNoteDisabled = !isStatusChanged;

  const setFieldValue = useCallback(
    <Key extends keyof AdminOrderManagementFormValues>(
      field: Key,
      value: AdminOrderManagementFormValues[Key],
    ) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
        ...(field === 'status' && value === order.status
          ? { statusNote: '' }
          : {}),
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
        ...(field === 'status' ? { statusNote: undefined } : {}),
      }));
      setFormError(null);
      setSuccessMessage(null);
    },
    [order.status],
  );

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    const validationResult =
      adminOrderManagementFormSchema.safeParse(values);

    if (!validationResult.success) {
      setFieldErrors(
        getZodFieldErrors<AdminOrderManagementFormValues>(
          validationResult.error,
        ),
      );
      return;
    }

    const nextValues = validationResult.data;
    const currentTrackingNumber = order.trackingNumber ?? '';
    const currentAdminNote = order.adminNote ?? '';
    const hasStatusChanged = nextValues.status !== order.status;
    const hasTrackingChanged =
      nextValues.trackingNumber !== currentTrackingNumber;
    const hasNoteChanged = nextValues.adminNote !== currentAdminNote;

    if (!hasStatusChanged && nextValues.statusNote) {
      setFieldErrors((prev) => ({
        ...prev,
        statusNote: 'Change status to add a status history note',
      }));
      return;
    }

    if (!hasStatusChanged && !hasTrackingChanged && !hasNoteChanged) {
      setSuccessMessage('No changes to save.');
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setSuccessMessage(null);

    try {
      const payload: UpdateAdminOrderPayload = {};

      if (hasStatusChanged) {
        payload.status = nextValues.status;
        payload.statusNote = nextValues.statusNote || undefined;
      }

      if (hasTrackingChanged) {
        payload.trackingNumber = nextValues.trackingNumber;
      }

      if (hasNoteChanged) {
        payload.adminNote = nextValues.adminNote;
      }

      const response = await updateOrderMutation.mutateAsync({
        orderId: order._id,
        payload,
      });

      if (!response.success) {
        setFormError(response.message);
        return;
      }

      setValues((prev) => ({
        ...prev,
        ...nextValues,
        statusNote: '',
      }));
      setSuccessMessage('Order updated successfully.');
    } catch (error) {
      setFormError(getUnknownErrorMessage(error));
    }
  }, [
    isSubmitting,
    order._id,
    order.adminNote,
    order.status,
    order.trackingNumber,
    updateOrderMutation,
    values,
  ]);

  const submitForm = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  }, [submit]);

  return useMemo(
    () => ({
      errorMessage: formError,
      fieldErrors,
      isSubmitting,
      isStatusNoteDisabled,
      setFieldValue,
      successMessage,
      values,
      onSubmit: submitForm,
    }),
    [
      fieldErrors,
      formError,
      isSubmitting,
      isStatusNoteDisabled,
      setFieldValue,
      submitForm,
      successMessage,
      values,
    ],
  );
};
