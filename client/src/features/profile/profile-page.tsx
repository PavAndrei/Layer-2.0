import { useSearchParams } from 'react-router';

import {
  ORDER_STATUSES,
  type OrderStatus,
} from '../../entities/order';
import { useScrollToTopOnChange } from '../../shared/hooks';
import { FeedbackMessage, Pagination, Skeleton } from '../../shared/ui';
import {
  OrdersEmptyState,
  OrdersList,
  OrdersStatusTabs,
  useOrders,
} from '../orders';
import {
  DEFAULT_PROFILE_SECTION,
  PROFILE_SECTION_LABELS,
  isProfileSection,
  useProfile,
} from './model';
import type { ProfileSection } from './model';
import {
  ProfileContentLayout,
  ProfileDetails,
  ProfileEmailVerification,
  ProfileLayout,
  ProfileSectionHeader,
} from './ui';
import { useProfileEmailVerification } from './use-profile-email-verification';

const getProfileSectionFromSearchParams = (
  searchParams: URLSearchParams,
): ProfileSection => {
  const section = searchParams.get('section') ?? '';

  return isProfileSection(section) ? section : DEFAULT_PROFILE_SECTION;
};

const getOrderStatusFromSearchParams = (
  searchParams: URLSearchParams,
): OrderStatus | undefined => {
  const status = searchParams.get('status') ?? '';

  return ORDER_STATUSES.some((orderStatus) => orderStatus === status)
    ? (status as OrderStatus)
    : undefined;
};

const getOrdersPageFromSearchParams = (
  searchParams: URLSearchParams,
): number => {
  const page = Number(searchParams.get('page'));

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const ORDERS_PAGE_LIMIT = 10;

const placeholderDescriptions: Record<
  Exclude<ProfileSection, 'orders' | 'profile' | 'security'>,
  string
> = {
  reviews: 'Your product reviews will appear here.',
  favorites: 'Your saved products will appear here.',
};

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = getProfileSectionFromSearchParams(searchParams);
  const activeOrderStatus = getOrderStatusFromSearchParams(searchParams);
  const activeOrdersPage = getOrdersPageFromSearchParams(searchParams);
  const profileQuery = useProfile();
  const emailVerification = useProfileEmailVerification();
  const ordersQuery = useOrders({
    enabled: activeSection === 'orders',
    params: {
      limit: ORDERS_PAGE_LIMIT,
      page: activeOrdersPage,
      status: activeOrderStatus,
    },
  });
  const scrollDependency =
    activeSection === 'orders'
      ? `orders:${activeOrderStatus ?? 'all'}:${activeOrdersPage}`
      : activeSection;

  useScrollToTopOnChange(scrollDependency);

  const handleOrdersPageChange = (page: number) => {
    const nextSearchParams = new URLSearchParams();

    nextSearchParams.set('section', 'orders');

    if (activeOrderStatus) {
      nextSearchParams.set('status', activeOrderStatus);
    }

    if (page > 1) {
      nextSearchParams.set('page', String(page));
    }

    setSearchParams(nextSearchParams);
  };

  if (profileQuery.isPending) {
    return (
      <ProfileLayout>
        <ProfileContentLayout activeSection={activeSection}>
          <Skeleton className="h-48 w-full" />
        </ProfileContentLayout>
      </ProfileLayout>
    );
  }

  if (profileQuery.isError || !profileQuery.data?.success) {
    return (
      <ProfileLayout>
        <ProfileContentLayout activeSection={activeSection}>
          <FeedbackMessage
            tone="danger"
            title="Profile is unavailable"
            description={
              profileQuery.data?.message ??
              'Refresh the page or sign in again.'
            }
          />
        </ProfileContentLayout>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <ProfileContentLayout activeSection={activeSection}>
        {activeSection === 'profile' && (
          <>
            <ProfileSectionHeader
              title="Profile"
              description="Review your account details."
            />
            <ProfileDetails user={profileQuery.data.data.user} />
          </>
        )}

        {activeSection === 'orders' && (
          <>
            <ProfileSectionHeader
              title="Orders"
              description="Track recent orders and review their current status."
            />
            <OrdersStatusTabs activeStatus={activeOrderStatus ?? null} />
            {ordersQuery.isLoading && <Skeleton className="h-48 w-full" />}
            {ordersQuery.error && (
              <FeedbackMessage
                tone="danger"
                title="Orders are unavailable"
                description={ordersQuery.error}
              />
            )}
            {!ordersQuery.isLoading &&
              !ordersQuery.error &&
              ordersQuery.orders.length === 0 && <OrdersEmptyState />}
            {!ordersQuery.isLoading &&
              !ordersQuery.error &&
              ordersQuery.orders.length > 0 && (
                <>
                  <OrdersList orders={ordersQuery.orders} />
                  {ordersQuery.pagination && (
                    <Pagination
                      currentPage={ordersQuery.pagination.page}
                      limit={ordersQuery.pagination.limit}
                      total={ordersQuery.pagination.total}
                      onPageChange={handleOrdersPageChange}
                    />
                  )}
                </>
              )}
          </>
        )}

        {activeSection === 'security' && (
          <>
            <ProfileSectionHeader
              title="Security"
              description="Manage account verification and security settings."
            />
            <ProfileEmailVerification
              error={emailVerification.error}
              isEmailVerified={profileQuery.data.data.user.isEmailVerified}
              isPending={emailVerification.isPending}
              isSuccess={emailVerification.isSuccess}
              resendAvailableInSeconds={
                emailVerification.resendAvailableInSeconds
              }
              onRequest={emailVerification.requestEmailVerification}
            />
          </>
        )}

        {activeSection !== 'orders' &&
          activeSection !== 'profile' &&
          activeSection !== 'security' && (
          <>
            <ProfileSectionHeader
              title={PROFILE_SECTION_LABELS[activeSection]}
              description={placeholderDescriptions[activeSection]}
            />
            <FeedbackMessage
              title={`${PROFILE_SECTION_LABELS[activeSection]} coming soon`}
              description="This account section is prepared and will be connected next."
            />
          </>
          )}
      </ProfileContentLayout>
    </ProfileLayout>
  );
};
