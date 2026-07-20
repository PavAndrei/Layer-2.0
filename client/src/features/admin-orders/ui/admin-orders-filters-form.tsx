import type { AdminOrdersFilters } from '../model';
import {
  ADMIN_ORDER_PAYMENT_STATUS_FILTER_OPTIONS,
  ADMIN_ORDER_STATUS_FILTER_OPTIONS,
} from '../model';
import {
  Button,
  SelectFilter,
  TextInput,
} from '../../../shared/ui';

type AdminOrdersFiltersFormProps = {
  paymentStatus: AdminOrdersFilters['paymentStatus'];
  search: string;
  status: AdminOrdersFilters['status'];
  onPaymentStatusChange: (
    paymentStatus: AdminOrdersFilters['paymentStatus'],
  ) => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: AdminOrdersFilters['status']) => void;
};

export const AdminOrdersFiltersForm = ({
  paymentStatus,
  search,
  status,
  onPaymentStatusChange,
  onReset,
  onSearchChange,
  onStatusChange,
}: AdminOrdersFiltersFormProps) => {
  const selectedStatus =
    ADMIN_ORDER_STATUS_FILTER_OPTIONS.find(
      (option) => option.value === status,
    ) ?? ADMIN_ORDER_STATUS_FILTER_OPTIONS[0];
  const selectedPaymentStatus =
    ADMIN_ORDER_PAYMENT_STATUS_FILTER_OPTIONS.find(
      (option) => option.value === paymentStatus,
    ) ?? ADMIN_ORDER_PAYMENT_STATUS_FILTER_OPTIONS[0];

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]">
        <TextInput
          id="admin-orders-search"
          label="Search orders"
          placeholder="Order number or customer email..."
          value={search}
          onChange={onSearchChange}
        />

        <SelectFilter
          id="admin-orders-status"
          label="Order status:"
          options={ADMIN_ORDER_STATUS_FILTER_OPTIONS}
          value={selectedStatus}
          onChange={(option) => onStatusChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-orders-payment-status"
          label="Payment status:"
          options={ADMIN_ORDER_PAYMENT_STATUS_FILTER_OPTIONS}
          value={selectedPaymentStatus}
          onChange={(option) => onPaymentStatusChange(option?.value ?? '')}
        />
      </div>

      <Button
        className="self-start"
        size="sm"
        type="button"
        variant="secondary"
        onClick={onReset}
      >
        Clear Filters
      </Button>
    </form>
  );
};
