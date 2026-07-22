import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import type { AdminUser, UserRole } from '../../entities/user';
import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  Button,
  ConfirmDialog,
  FeedbackMessage,
  Skeleton,
} from '../../shared/ui';
import {
  useAdminUser,
  useRevokeAdminUserSessions,
  useUpdateAdminUser,
} from './model';
import {
  AdminUserInfoCard,
  AdminUserManagementCard,
  AdminUserNoteCard,
  AdminUserPageHeader,
  AdminUserRecentOrdersCard,
  AdminUserRecentReviewsCard,
  AdminUserStatsGrid,
} from './ui';

const AdminUserPageSkeleton = () => (
  <>
    <Skeleton className="h-24 w-full" />
    <div className="flex flex-col gap-6">
      <Skeleton className="h-72 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  </>
);

type AdminUserStatusAction = 'block' | 'unblock';
type AdminUserSessionAction = 'revoke-sessions';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
};

const getUserStatusActionConfig = (
  action: AdminUserStatusAction | null,
  user: AdminUser | null,
) => {
  if (action === 'block') {
    return {
      confirmLabel: 'Block user',
      confirmingLabel: 'Blocking...',
      description: user
        ? `${user.name} will lose access to the account and active sessions will be revoked.`
        : undefined,
      isBlocked: true,
      title: 'Block user',
      tone: 'danger' as const,
    };
  }

  if (action === 'unblock') {
    return {
      confirmLabel: 'Unblock user',
      confirmingLabel: 'Unblocking...',
      description: user
        ? `${user.name} will be able to access the account again.`
        : undefined,
      isBlocked: false,
      title: 'Unblock user',
      tone: 'neutral' as const,
    };
  }

  return null;
};

const getUserRoleActionConfig = (
  role: UserRole | null,
  user: AdminUser | null,
) => {
  if (!role) return null;

  return {
    confirmLabel: 'Change role',
    confirmingLabel: 'Changing...',
    description: user
      ? `${user.name} role will change from ${roleLabels[user.role]} to ${roleLabels[role]}. Active sessions will be revoked.`
      : undefined,
    role,
    title: 'Change user role',
    tone: 'neutral' as const,
  };
};

const getUserSessionActionConfig = (
  action: AdminUserSessionAction | null,
  user: AdminUser | null,
) => {
  if (action !== 'revoke-sessions') return null;

  return {
    confirmLabel: 'End sessions',
    confirmingLabel: 'Ending...',
    description: user
      ? `${user.name} will be signed out from all active sessions.`
      : undefined,
    title: 'End all sessions',
    tone: 'danger' as const,
  };
};

const getUpdateUserError = (
  mutation: ReturnType<typeof useUpdateAdminUser>,
) => {
  if (mutation.data && !mutation.data.success) {
    return mutation.data.message;
  }

  if (mutation.error instanceof Error) {
    return mutation.error.message;
  }

  return null;
};

const getRevokeSessionsError = (
  mutation: ReturnType<typeof useRevokeAdminUserSessions>,
) => {
  if (mutation.data && !mutation.data.success) {
    return mutation.data.message;
  }

  if (mutation.error instanceof Error) {
    return mutation.error.message;
  }

  return null;
};

export const AdminUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const adminUserQuery = useAdminUser({ userId });
  const { error, isLoading, refetch, user } = adminUserQuery;
  const updateUserMutation = useUpdateAdminUser();
  const revokeSessionsMutation = useRevokeAdminUserSessions();
  const [statusAction, setStatusAction] =
    useState<AdminUserStatusAction | null>(null);
  const [roleAction, setRoleAction] = useState<UserRole | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [sessionAction, setSessionAction] =
    useState<AdminUserSessionAction | null>(null);
  const statusActionConfig = getUserStatusActionConfig(statusAction, user);
  const roleActionConfig = getUserRoleActionConfig(roleAction, user);
  const sessionActionConfig = getUserSessionActionConfig(sessionAction, user);
  const activeActionConfig =
    statusActionConfig ?? roleActionConfig ?? sessionActionConfig;
  const isActionPending =
    updateUserMutation.isPending || revokeSessionsMutation.isPending;
  const actionError =
    getUpdateUserError(updateUserMutation) ??
    getRevokeSessionsError(revokeSessionsMutation);
  const resetActions = () => {
    setStatusAction(null);
    setRoleAction(null);
    setSessionAction(null);
  };
  const resetMutations = () => {
    updateUserMutation.reset();
    revokeSessionsMutation.reset();
  };
  const openStatusAction = (action: AdminUserStatusAction) => {
    resetMutations();
    setSessionAction(null);
    setStatusAction(action);
    setRoleAction(null);
  };
  const openRoleAction = (role: UserRole) => {
    resetMutations();
    setStatusAction(null);
    setSessionAction(null);
    setRoleAction(role);
  };
  const openSessionAction = (action: AdminUserSessionAction) => {
    resetMutations();
    setStatusAction(null);
    setRoleAction(null);
    setSessionAction(action);
  };
  const handleCloseActionDialog = () => {
    if (isActionPending) return;

    resetActions();
    resetMutations();
  };
  const handleConfirmAction = () => {
    if (!user || !activeActionConfig) return;

    if (sessionActionConfig) {
      revokeSessionsMutation.mutate(
        {
          userId: user._id,
        },
        {
          onSuccess: (response) => {
            if (!response.success) return;

            resetActions();
          },
        },
      );
      return;
    }

    updateUserMutation.mutate(
      {
        payload: {
          ...(statusActionConfig
            ? { isBlocked: statusActionConfig.isBlocked }
            : {}),
          ...(roleActionConfig ? { role: roleActionConfig.role } : {}),
        },
        userId: user._id,
      },
      {
        onSuccess: (response) => {
          if (!response.success) return;

          resetActions();
        },
      },
    );
  };
  const handleSubmitAdminNote = () => {
    if (!user) return;

    updateUserMutation.mutate({
      payload: {
        adminNote,
      },
      userId: user._id,
    });
  };

  useEffect(() => {
    setAdminNote(user?.adminNote ?? '');
  }, [user?._id, user?.adminNote]);

  useScrollToTopOnChange(userId, {
    behavior: 'auto',
    skipInitialScroll: false,
  });

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <AdminUserPageHeader user={user} />

      {isLoading && <AdminUserPageSkeleton />}

      {!isLoading && !user && (
        <FeedbackMessage
          tone="danger"
          title="User is unavailable"
          description={error ?? 'Refresh the page or return to admin users.'}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="sm" variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
              <Link
                to="/admin?section=users"
                className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
              >
                Back to users
              </Link>
            </div>
          }
        />
      )}

      {!isLoading && user && (
        <div className="flex flex-col gap-6">
          <AdminUserInfoCard user={user} />
          <AdminUserStatsGrid stats={user.stats} />
          <AdminUserNoteCard
            isSubmitting={updateUserMutation.isPending}
            value={adminNote}
            onSubmit={handleSubmitAdminNote}
            onValueChange={setAdminNote}
          />
          <AdminUserManagementCard
            isActionPending={isActionPending}
            user={user}
            onBlockUser={() => openStatusAction('block')}
            onRevokeSessions={() => openSessionAction('revoke-sessions')}
            onRoleChange={openRoleAction}
            onUnblockUser={() => openStatusAction('unblock')}
          />
          <AdminUserRecentOrdersCard
            orders={user.recentOrders}
            userId={user._id}
          />
          <AdminUserRecentReviewsCard
            reviews={user.recentReviews}
            userId={user._id}
          />
        </div>
      )}

      <ConfirmDialog
        confirmLabel={activeActionConfig?.confirmLabel}
        confirmingLabel={activeActionConfig?.confirmingLabel}
        description={actionError ?? activeActionConfig?.description}
        isConfirming={isActionPending}
        isOpen={Boolean(activeActionConfig)}
        title={activeActionConfig?.title ?? 'Update user'}
        tone={activeActionConfig?.tone ?? 'neutral'}
        onCancel={handleCloseActionDialog}
        onConfirm={handleConfirmAction}
      />
    </main>
  );
};
