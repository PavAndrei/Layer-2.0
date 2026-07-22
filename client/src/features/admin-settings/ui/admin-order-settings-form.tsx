import type { FormEvent } from 'react';

import {
  Button,
  FeedbackMessage,
} from '../../../shared/ui';
import type { AdminOrderSettingsFormValues } from '../model';

type AdminOrderSettingsFormProps = {
  error: string | null;
  hasChanges: boolean;
  isSubmitting: boolean;
  successMessage: string | null;
  values: AdminOrderSettingsFormValues;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: <Field extends keyof AdminOrderSettingsFormValues>(
    field: Field,
    value: AdminOrderSettingsFormValues[Field],
  ) => void;
};

export const AdminOrderSettingsForm = ({
  error,
  hasChanges,
  isSubmitting,
  onReset,
  onSubmit,
  onValueChange,
  successMessage,
  values,
}: AdminOrderSettingsFormProps) => (
  <form
    className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
    noValidate
    onSubmit={onSubmit}
  >
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">
        Order settings
      </h3>
      <p className="block-small text-typography-secondary">
        Control checkout availability and account requirements for placing
        orders.
      </p>
    </div>

    {error && (
      <FeedbackMessage
        tone="danger"
        title="Order settings could not be saved"
        description={error}
      />
    )}

    {successMessage && (
      <FeedbackMessage
        title="Order settings saved"
        description={successMessage}
      />
    )}

    <section className="flex flex-col divide-y divide-border-soft rounded border border-border-soft bg-background-primary">
      <label className="flex items-start gap-3 p-3">
        <input
          checked={values.ordersEnabled}
          className="mt-1 size-4 rounded border-border-strong accent-accent-primary"
          type="checkbox"
          onChange={(event) =>
            onValueChange('ordersEnabled', event.target.checked)
          }
        />
        <span className="flex flex-col gap-1">
          <span className="block-medium text-typography-heading">
            Accept new orders
          </span>
          <span className="block-small text-typography-secondary">
            When disabled, catalog and cart stay available, but checkout is
            blocked for customers.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 p-3">
        <input
          checked={values.requireVerifiedEmailForCheckout}
          className="mt-1 size-4 rounded border-border-strong accent-accent-primary"
          type="checkbox"
          onChange={(event) =>
            onValueChange(
              'requireVerifiedEmailForCheckout',
              event.target.checked,
            )
          }
        />
        <span className="flex flex-col gap-1">
          <span className="block-medium text-typography-heading">
            Require verified email for checkout
          </span>
          <span className="block-small text-typography-secondary">
            When enabled, customers must confirm their email before placing
            an order.
          </span>
        </span>
      </label>
    </section>

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
