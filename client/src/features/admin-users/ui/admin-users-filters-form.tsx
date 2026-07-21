import type { AdminUsersFilters } from '../model';
import {
  ADMIN_USER_PROVIDER_FILTER_OPTIONS,
  ADMIN_USER_ROLE_FILTER_OPTIONS,
  ADMIN_USER_SORT_FILTER_OPTIONS,
  ADMIN_USER_STATUS_FILTER_OPTIONS,
  ADMIN_USER_VERIFICATION_FILTER_OPTIONS,
} from '../model';
import {
  Button,
  SelectFilter,
  TextInput,
} from '../../../shared/ui';

type AdminUsersFiltersFormProps = {
  isEmailVerified: AdminUsersFilters['isEmailVerified'];
  provider: AdminUsersFilters['provider'];
  role: AdminUsersFilters['role'];
  search: string;
  sort: AdminUsersFilters['sort'];
  status: AdminUsersFilters['status'];
  onEmailVerificationChange: (
    isEmailVerified: AdminUsersFilters['isEmailVerified'],
  ) => void;
  onProviderChange: (provider: AdminUsersFilters['provider']) => void;
  onReset: () => void;
  onRoleChange: (role: AdminUsersFilters['role']) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: AdminUsersFilters['sort']) => void;
  onStatusChange: (status: AdminUsersFilters['status']) => void;
};

export const AdminUsersFiltersForm = ({
  isEmailVerified,
  provider,
  role,
  search,
  sort,
  status,
  onEmailVerificationChange,
  onProviderChange,
  onReset,
  onRoleChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: AdminUsersFiltersFormProps) => {
  const selectedRole =
    ADMIN_USER_ROLE_FILTER_OPTIONS.find((option) => option.value === role) ??
    ADMIN_USER_ROLE_FILTER_OPTIONS[0];
  const selectedProvider =
    ADMIN_USER_PROVIDER_FILTER_OPTIONS.find(
      (option) => option.value === provider,
    ) ?? ADMIN_USER_PROVIDER_FILTER_OPTIONS[0];
  const selectedVerification =
    ADMIN_USER_VERIFICATION_FILTER_OPTIONS.find(
      (option) => option.value === isEmailVerified,
    ) ?? ADMIN_USER_VERIFICATION_FILTER_OPTIONS[0];
  const selectedStatus =
    ADMIN_USER_STATUS_FILTER_OPTIONS.find(
      (option) => option.value === status,
    ) ?? ADMIN_USER_STATUS_FILTER_OPTIONS[0];
  const selectedSort =
    ADMIN_USER_SORT_FILTER_OPTIONS.find((option) => option.value === sort) ??
    ADMIN_USER_SORT_FILTER_OPTIONS[0];

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(12rem,1fr))]">
        <TextInput
          id="admin-users-search"
          label="Search users"
          placeholder="Email or username..."
          value={search}
          onChange={onSearchChange}
        />

        <SelectFilter
          id="admin-users-role"
          label="Role:"
          options={ADMIN_USER_ROLE_FILTER_OPTIONS}
          value={selectedRole}
          onChange={(option) => onRoleChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-users-provider"
          label="Provider:"
          options={ADMIN_USER_PROVIDER_FILTER_OPTIONS}
          value={selectedProvider}
          onChange={(option) => onProviderChange(option?.value ?? '')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SelectFilter
          id="admin-users-verification"
          label="Verification:"
          options={ADMIN_USER_VERIFICATION_FILTER_OPTIONS}
          value={selectedVerification}
          onChange={(option) =>
            onEmailVerificationChange(option?.value ?? '')
          }
        />

        <SelectFilter
          id="admin-users-status"
          label="Status:"
          options={ADMIN_USER_STATUS_FILTER_OPTIONS}
          value={selectedStatus}
          onChange={(option) => onStatusChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-users-sort"
          label="Sort:"
          options={ADMIN_USER_SORT_FILTER_OPTIONS}
          value={selectedSort}
          onChange={(option) => onSortChange(option?.value ?? 'newest')}
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
