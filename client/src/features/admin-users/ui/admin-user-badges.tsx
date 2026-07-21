import type {
  UserAuthProvider,
  UserRole,
  UserStatus,
} from '../../../entities/user';

type AdminUserRoleBadgeProps = {
  role: UserRole;
};

type AdminUserStatusBadgeProps = {
  status: UserStatus;
};

type AdminUserProviderBadgesProps = {
  providers: UserAuthProvider[];
};

type AdminUserVerificationBadgeProps = {
  isVerified: boolean;
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
};

const roleClasses: Record<UserRole, string> = {
  admin: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  customer:
    'border-border-strong bg-background-secondary text-typography-primary',
};

const statusLabels: Record<UserStatus, string> = {
  active: 'Active',
  blocked: 'Blocked',
};

const statusClasses: Record<UserStatus, string> = {
  active: 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary',
  blocked:
    'border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary',
};

const providerLabels: Record<UserAuthProvider, string> = {
  google: 'Google',
  password: 'Email',
};

export const AdminUserRoleBadge = ({ role }: AdminUserRoleBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${roleClasses[role]}`}
  >
    {roleLabels[role]}
  </span>
);

export const AdminUserStatusBadge = ({
  status,
}: AdminUserStatusBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${statusClasses[status]}`}
  >
    {statusLabels[status]}
  </span>
);

export const AdminUserProviderBadges = ({
  providers,
}: AdminUserProviderBadgesProps) => (
  <div className="flex flex-wrap gap-2">
    {providers.map((provider) => (
      <span
        key={provider}
        className="inline-flex min-h-8 w-fit items-center rounded border border-border-strong bg-background-secondary px-3 py-1 block-small text-typography-primary"
      >
        {providerLabels[provider]}
      </span>
    ))}
  </div>
);

export const AdminUserVerificationBadge = ({
  isVerified,
}: AdminUserVerificationBadgeProps) => (
  <span
    className={`inline-flex min-h-8 w-fit items-center rounded border px-3 py-1 block-small ${
      isVerified
        ? 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary'
        : 'border-border-strong bg-background-secondary text-typography-muted'
    }`}
  >
    {isVerified ? 'Verified' : 'Not verified'}
  </span>
);
