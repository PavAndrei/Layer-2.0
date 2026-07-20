import type { FormEvent } from 'react';

import type {
  AdminOrderManagementFormErrors,
  AdminOrderManagementFormValues,
} from '../model';
import { ADMIN_ORDER_STATUS_OPTIONS } from '../model';
import {
  Button,
  FeedbackMessage,
  SelectFilter,
  TextInput,
} from '../../../shared/ui';

type AdminOrderManagementFormProps = {
  errorMessage: string | null;
  fieldErrors: AdminOrderManagementFormErrors;
  isSubmitting: boolean;
  isStatusNoteDisabled: boolean;
  successMessage: string | null;
  values: AdminOrderManagementFormValues;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: <Key extends keyof AdminOrderManagementFormValues>(
    field: Key,
    value: AdminOrderManagementFormValues[Key],
  ) => void;
};

const textareaClasses =
  'min-h-24 w-full resize-none rounded border border-border-strong bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60';

export const AdminOrderManagementForm = ({
  errorMessage,
  fieldErrors,
  isSubmitting,
  isStatusNoteDisabled,
  successMessage,
  values,
  onSubmit,
  onValueChange,
}: AdminOrderManagementFormProps) => {
  const selectedStatus =
    ADMIN_ORDER_STATUS_OPTIONS.find(
      (option) => option.value === values.status,
    ) ?? ADMIN_ORDER_STATUS_OPTIONS[0];

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1">
        <h2 className="block-title text-typography-heading">Management</h2>
        <p className="block-small text-typography-secondary">
          Update fulfillment details and internal admin notes.
        </p>
      </div>

      {successMessage && (
        <FeedbackMessage
          title="Order saved"
          description={successMessage}
        />
      )}

      {errorMessage && (
        <FeedbackMessage
          tone="danger"
          title="Order was not saved"
          description={errorMessage}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectFilter
          id="admin-order-status"
          label="Order status:"
          options={ADMIN_ORDER_STATUS_OPTIONS}
          value={selectedStatus}
          onChange={(option) => {
            if (!option) return;

            onValueChange('status', option.value);
          }}
        />

        <TextInput
          id="admin-order-tracking-number"
          label="Tracking number"
          placeholder="Add tracking number..."
          value={values.trackingNumber}
          error={fieldErrors.trackingNumber}
          disabled={isSubmitting}
          onChange={(value) => onValueChange('trackingNumber', value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor="admin-order-status-note"
        >
          Status change note
        </label>
        <textarea
          id="admin-order-status-note"
          className={[
            textareaClasses,
            fieldErrors.statusNote ? 'border-red-600' : '',
          ].join(' ')}
          disabled={isSubmitting || isStatusNoteDisabled}
          placeholder={
            isStatusNoteDisabled
              ? 'Change status to add a history note...'
              : 'Optional note for status history...'
          }
          value={values.statusNote}
          onChange={(event) =>
            onValueChange('statusNote', event.target.value)
          }
        />
        {fieldErrors.statusNote && (
          <p className="block-small text-red-600">
            {fieldErrors.statusNote}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor="admin-order-admin-note"
        >
          Internal note
        </label>
        <textarea
          id="admin-order-admin-note"
          className={[
            textareaClasses,
            'min-h-32',
            fieldErrors.adminNote ? 'border-red-600' : '',
          ].join(' ')}
          disabled={isSubmitting}
          placeholder="Add an internal note for the admin team..."
          value={values.adminNote}
          onChange={(event) =>
            onValueChange('adminNote', event.target.value)
          }
        />
        {fieldErrors.adminNote && (
          <p className="block-small text-red-600">{fieldErrors.adminNote}</p>
        )}
      </div>

      <Button
        className="self-start"
        disabled={isSubmitting}
        type="submit"
        variant="primary"
      >
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
};
