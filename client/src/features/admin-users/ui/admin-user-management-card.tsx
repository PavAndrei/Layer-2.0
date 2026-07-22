import {
  USER_ROLES,
  type AdminUser,
  type UserRole,
} from '../../../entities/user';
import {
  Button,
  SelectFilter,
  type SelectFilterOption,
} from '../../../shared/ui';

type AdminUserManagementCardProps = {
  isActionPending?: boolean;
  user: AdminUser;
  onBlockUser: () => void;
  onRevokeSessions: () => void;
  onRoleChange: (role: UserRole) => void;
  onUnblockUser: () => void;
};

type AdminUserRoleOption = SelectFilterOption<UserRole>;

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
};

const roleOptions: readonly AdminUserRoleOption[] = USER_ROLES.map((role) => ({
  label: roleLabels[role],
  value: role,
}));

export const AdminUserManagementCard = ({
  isActionPending = false,
  onBlockUser,
  onRevokeSessions,
  onRoleChange,
  onUnblockUser,
  user,
}: AdminUserManagementCardProps) => {
  const isBlocked = user.status === 'blocked';
  const selectedRole =
    roleOptions.find((option) => option.value === user.role) ?? roleOptions[0];

  return (
    <section className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 className="block-title text-typography-heading">Management</h2>
        <p className="block-small text-typography-secondary">
          Control account access for this customer.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded border border-border-soft bg-background-secondary p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="block-medium text-typography-heading">
            {isBlocked ? 'User is blocked' : 'User is active'}
          </span>
          <span className="block-small text-typography-secondary">
            {isBlocked
              ? 'Unblock this account to restore access.'
              : 'Block this account to revoke active sessions and deny access.'}
          </span>
        </div>

        <Button
          className="w-full sm:w-fit"
          disabled={isActionPending}
          size="sm"
          variant={isBlocked ? 'primary' : 'danger'}
          onClick={isBlocked ? onUnblockUser : onBlockUser}
        >
          {isBlocked ? 'Unblock user' : 'Block user'}
        </Button>
      </div>

      <div className="grid gap-3 rounded border border-border-soft bg-background-secondary p-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)] sm:items-end">
        <div className="flex flex-col gap-1">
          <span className="block-medium text-typography-heading">
            User role
          </span>
          <span className="block-small text-typography-secondary">
            Change account permissions for this user.
          </span>
        </div>

        <SelectFilter
          id={`admin-user-role-${user._id}`}
          label="Role:"
          options={roleOptions}
          value={selectedRole}
          onChange={(option) => {
            const nextRole = option?.value;

            if (!nextRole || nextRole === user.role) return;

            onRoleChange(nextRole);
          }}
        />
      </div>

      <div className="flex flex-col gap-3 rounded border border-border-soft bg-background-secondary p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="block-medium text-typography-heading">
            Active sessions
          </span>
          <span className="block-small text-typography-secondary">
            End all active sessions for this user without changing account status.
          </span>
        </div>

        <Button
          className="w-full sm:w-fit"
          disabled={isActionPending || user.stats.activeSessionsCount === 0}
          size="sm"
          variant="secondary"
          onClick={onRevokeSessions}
        >
          End all sessions
        </Button>
      </div>
    </section>
  );
};
