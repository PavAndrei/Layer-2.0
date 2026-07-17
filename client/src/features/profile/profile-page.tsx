import { useSearchParams } from 'react-router';

import {
  ORDER_STATUSES,
  type OrderStatus,
} from '../../entities/order';
import { useScrollToTopOnChange } from '../../shared/hooks';
import { FeedbackMessage, Pagination, Skeleton } from '../../shared/ui';
import {
  UserReviewsEmptyState,
  UserReviewsList,
  useUserReviews,
} from '../reviews';
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

const getPageFromSearchParams = (
  searchParams: URLSearchParams,
): number => {
  const page = Number(searchParams.get('page'));

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const ORDERS_PAGE_LIMIT = 10;
const REVIEWS_PAGE_LIMIT = 10;

const placeholderDescriptions: Record<
  Exclude<ProfileSection, 'orders' | 'profile' | 'reviews' | 'security'>,
  string
> = {
  favorites: 'Your saved products will appear here.',
};

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = getProfileSectionFromSearchParams(searchParams);
  const activeOrderStatus = getOrderStatusFromSearchParams(searchParams);
  const activeOrdersPage = getPageFromSearchParams(searchParams);
  const activeReviewsPage = getPageFromSearchParams(searchParams);
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
  const reviewsQuery = useUserReviews({
    enabled: activeSection === 'reviews',
    params: {
      limit: REVIEWS_PAGE_LIMIT,
      page: activeReviewsPage,
    },
  });
  const scrollDependency =
    activeSection === 'orders'
      ? `orders:${activeOrderStatus ?? 'all'}:${activeOrdersPage}`
      : activeSection === 'reviews'
        ? `reviews:${activeReviewsPage}`
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

  const handleReviewsPageChange = (page: number) => {
    const nextSearchParams = new URLSearchParams();

    nextSearchParams.set('section', 'reviews');

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

        {activeSection === 'reviews' && (
          <>
            <ProfileSectionHeader
              title="Reviews"
              description="Review the product feedback you have shared."
            />
            {reviewsQuery.isLoading && <Skeleton className="h-48 w-full" />}
            {reviewsQuery.error && (
              <FeedbackMessage
                tone="danger"
                title="Reviews are unavailable"
                description={reviewsQuery.error}
              />
            )}
            {!reviewsQuery.isLoading &&
              !reviewsQuery.error &&
              reviewsQuery.reviews.length === 0 && <UserReviewsEmptyState />}
            {!reviewsQuery.isLoading &&
              !reviewsQuery.error &&
              reviewsQuery.reviews.length > 0 && (
                <>
                  <UserReviewsList reviews={reviewsQuery.reviews} />
                  {reviewsQuery.pagination && (
                    <Pagination
                      currentPage={reviewsQuery.pagination.page}
                      limit={reviewsQuery.pagination.limit}
                      total={reviewsQuery.pagination.total}
                      onPageChange={handleReviewsPageChange}
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
          activeSection !== 'reviews' &&
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
