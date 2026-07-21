import {
  AdminUsersFiltersForm,
  AdminUsersList,
} from '../admin-users';
import {
  FeedbackMessage,
  Pagination,
  SectionHeader,
  Skeleton,
} from '../../shared/ui';
import type { AdminUsersSectionState } from './use-admin-users-section';

const AdminUsersSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-40 w-full" />
    ))}
  </div>
);

export const AdminUsersSection = ({
  filters,
  onPageChange,
  usersQuery,
}: AdminUsersSectionState) => {
  const isWaitingForInitialUsers =
    usersQuery.users.length === 0 &&
    (usersQuery.isLoading || filters.isDebouncing);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Users"
        description="Review customer accounts, authentication state, and order activity."
      />

      <AdminUsersFiltersForm
        isEmailVerified={filters.isEmailVerified}
        provider={filters.provider}
        role={filters.role}
        search={filters.search}
        sort={filters.sort}
        status={filters.status}
        onEmailVerificationChange={filters.handleEmailVerificationChange}
        onProviderChange={filters.handleProviderChange}
        onReset={filters.resetFilters}
        onRoleChange={filters.handleRoleChange}
        onSearchChange={filters.handleSearchChange}
        onSortChange={filters.handleSortChange}
        onStatusChange={filters.handleStatusChange}
      />

      {isWaitingForInitialUsers && <AdminUsersSkeleton />}

      {!isWaitingForInitialUsers && usersQuery.error && (
        <FeedbackMessage
          tone="danger"
          title="Users are unavailable"
          description={usersQuery.error}
        />
      )}

      {!isWaitingForInitialUsers &&
        !usersQuery.error &&
        usersQuery.users.length === 0 && (
          <FeedbackMessage
            title="No users found"
            description="Users will appear here after account registration."
          />
        )}

      {!isWaitingForInitialUsers &&
        !usersQuery.error &&
        usersQuery.users.length > 0 && (
          <>
            <AdminUsersList users={usersQuery.users} />

            {usersQuery.pagination && (
              <Pagination
                currentPage={usersQuery.pagination.page}
                limit={usersQuery.pagination.limit}
                total={usersQuery.pagination.total}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
    </section>
  );
};
