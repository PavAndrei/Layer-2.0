import { Link, useParams } from 'react-router';

import type { AdminUser } from '../../entities/user';
import { useScrollToTopOnChange } from '../../shared/hooks';
import { Button, FeedbackMessage, Skeleton } from '../../shared/ui';
import { useAdminUser } from './model';
import {
  AdminUserInfoCard,
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

const AdminUserLoadedContent = ({ user }: { user: AdminUser }) => (
  <div className="flex flex-col gap-6">
    <AdminUserInfoCard user={user} />
    <AdminUserStatsGrid stats={user.stats} />
    <AdminUserRecentOrdersCard
      orders={user.recentOrders}
      userId={user._id}
    />
    <AdminUserRecentReviewsCard
      reviews={user.recentReviews}
      userId={user._id}
    />
  </div>
);

export const AdminUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const adminUserQuery = useAdminUser({ userId });
  const { error, isLoading, refetch, user } = adminUserQuery;

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

      {!isLoading && user && <AdminUserLoadedContent user={user} />}
    </main>
  );
};
