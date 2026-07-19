import { useSearchParams } from 'react-router';

import {
  ORDER_STATUSES,
  type OrderStatus,
} from '../../../entities/order';
import { useScrollToTopOnChange } from '../../../shared/hooks';
import {
  DEFAULT_PROFILE_SECTION,
  isProfileSection,
  type ProfileSection,
} from './profile-sections';

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

export const useProfilePageState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = getProfileSectionFromSearchParams(searchParams);
  const activeOrderStatus = getOrderStatusFromSearchParams(searchParams);
  const activeOrdersPage = getPageFromSearchParams(searchParams);
  const activeReviewsPage = getPageFromSearchParams(searchParams);
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

  return {
    activeOrderStatus,
    activeOrdersPage,
    activeReviewsPage,
    activeSection,
    handleOrdersPageChange,
    handleReviewsPageChange,
  };
};
