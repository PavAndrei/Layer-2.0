import type { FormEvent } from 'react';

import {
  STORE_SHIPPING_REGIONS,
  type StoreShippingRegion,
} from '../../../entities/store-settings';
import type { FieldErrors } from '../../../shared/lib';
import {
  Button,
  FeedbackMessage,
  TextInput,
} from '../../../shared/ui';
import type { AdminShippingSettingsFormValues } from '../model';

type AdminShippingSettingsFormProps = {
  error: string | null;
  fieldErrors: FieldErrors<AdminShippingSettingsFormValues>;
  hasChanges: boolean;
  isSubmitting: boolean;
  successMessage: string | null;
  values: AdminShippingSettingsFormValues;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: <
    Field extends keyof AdminShippingSettingsFormValues,
  >(
    field: Field,
    value: AdminShippingSettingsFormValues[Field],
  ) => void;
};

const SHIPPING_NOTICE_MAX_LENGTH = 300;

const SHIPPING_REGION_LABELS: Record<StoreShippingRegion, string> = {
  domestic: 'Domestic',
  worldwide: 'Worldwide',
};

export const AdminShippingSettingsForm = ({
  error,
  fieldErrors,
  hasChanges,
  isSubmitting,
  onReset,
  onSubmit,
  onValueChange,
  successMessage,
  values,
}: AdminShippingSettingsFormProps) => {
  const isFreeShippingThresholdDisabled = !values.freeShippingEnabled;

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1">
        <h3 className="block-title text-typography-heading">
          Shipping settings
        </h3>
        <p className="block-small text-typography-secondary">
          Configure shipping price, free shipping rules, delivery estimate,
          and public checkout messaging.
        </p>
      </div>

      {error && (
        <FeedbackMessage
          tone="danger"
          title="Shipping settings could not be saved"
          description={error}
        />
      )}

      {successMessage && (
        <FeedbackMessage
          title="Shipping settings saved"
          description={successMessage}
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          id="admin-standard-shipping-price"
          label="Standard shipping price"
          type="number"
          min={0}
          step="0.01"
          error={fieldErrors.standardShippingPrice}
          value={values.standardShippingPrice}
          onChange={(value) =>
            onValueChange('standardShippingPrice', value)
          }
        />

        <div className="flex flex-col gap-2">
          <label
            className="block-medium text-typography-heading"
            htmlFor="admin-shipping-region"
          >
            Shipping region
          </label>
          <select
            id="admin-shipping-region"
            className="min-h-11 w-full rounded border border-border-strong bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60"
            value={values.shippingRegion}
            onChange={(event) =>
              onValueChange(
                'shippingRegion',
                event.target.value as StoreShippingRegion,
              )
            }
          >
            {STORE_SHIPPING_REGIONS.map((region) => (
              <option key={region} value={region}>
                {SHIPPING_REGION_LABELS[region]}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded border border-border-soft bg-background-primary p-3">
        <label className="flex items-start gap-3">
          <input
            checked={values.freeShippingEnabled}
            className="mt-1 size-4 rounded border-border-strong accent-accent-primary"
            type="checkbox"
            onChange={(event) =>
              onValueChange('freeShippingEnabled', event.target.checked)
            }
          />
          <span className="flex flex-col gap-1">
            <span className="block-medium text-typography-heading">
              Enable free shipping threshold
            </span>
            <span className="block-small text-typography-secondary">
              When enabled, orders over the threshold qualify for free
              shipping.
            </span>
          </span>
        </label>

        <TextInput
          id="admin-free-shipping-threshold"
          label="Free shipping for orders over"
          type="number"
          min={0}
          step="0.01"
          disabled={isFreeShippingThresholdDisabled}
          error={fieldErrors.freeShippingThreshold}
          value={values.freeShippingThreshold}
          onChange={(value) =>
            onValueChange('freeShippingThreshold', value)
          }
        />
        <p className="block-small text-typography-muted">
          Set standard shipping price to $0 for free shipping on every
          order.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <TextInput
          required
          id="admin-estimated-delivery-min"
          label="Estimated delivery min days"
          type="number"
          min={1}
          step={1}
          error={fieldErrors.estimatedDeliveryDaysMin}
          value={values.estimatedDeliveryDaysMin}
          onChange={(value) =>
            onValueChange('estimatedDeliveryDaysMin', value)
          }
        />

        <TextInput
          required
          id="admin-estimated-delivery-max"
          label="Estimated delivery max days"
          type="number"
          min={1}
          step={1}
          error={fieldErrors.estimatedDeliveryDaysMax}
          value={values.estimatedDeliveryDaysMax}
          onChange={(value) =>
            onValueChange('estimatedDeliveryDaysMax', value)
          }
        />
      </section>

      <div className="flex flex-col gap-2">
        <label
          className="block-medium text-typography-heading"
          htmlFor="admin-shipping-notice"
        >
          Shipping notice
        </label>
        <textarea
          id="admin-shipping-notice"
          className={`min-h-28 w-full resize-none rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            fieldErrors.shippingNotice
              ? 'border-red-600'
              : 'border-border-strong'
          }`}
          aria-describedby={
            fieldErrors.shippingNotice
              ? 'admin-shipping-notice-error'
              : undefined
          }
          aria-invalid={Boolean(fieldErrors.shippingNotice)}
          maxLength={SHIPPING_NOTICE_MAX_LENGTH}
          value={values.shippingNotice}
          onChange={(event) =>
            onValueChange('shippingNotice', event.target.value)
          }
        />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          {fieldErrors.shippingNotice ? (
            <p
              id="admin-shipping-notice-error"
              className="block-small text-red-600"
            >
              {fieldErrors.shippingNotice}
            </p>
          ) : (
            <p className="block-small text-typography-muted">
              This message can be shown during checkout.
            </p>
          )}
          <span className="block-small text-typography-muted">
            {values.shippingNotice.length}/{SHIPPING_NOTICE_MAX_LENGTH}
          </span>
        </div>
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
};
