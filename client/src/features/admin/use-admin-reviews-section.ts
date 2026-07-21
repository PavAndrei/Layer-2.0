import { useEffect, useMemo } from 'react';

import {
  useAdminReviewModerationAction,
  useAdminReviews,
  useAdminReviewsFilters,
} from '../admin-reviews';
import type { AdminSection } from './model';

const ADMIN_REVIEWS_PAGE_LIMIT = 12;

type UseAdminReviewsSectionParams = {
  activeSection: AdminSection;
};

export const useAdminReviewsSection = ({
  activeSection,
}: UseAdminReviewsSectionParams) => {
  const filters = useAdminReviewsFilters();
  const moderationAction = useAdminReviewModerationAction();
  const {
    debouncedFilters,
    handlePageChange,
    isDebouncing,
    page,
    syncPage,
  } = filters;

  const params = useMemo(
    () => ({
      limit: ADMIN_REVIEWS_PAGE_LIMIT,
      page: debouncedFilters.page,
      rating: debouncedFilters.rating || undefined,
      search: debouncedFilters.search || undefined,
      userId: debouncedFilters.userId || undefined,
      verifiedPurchase:
        debouncedFilters.verifiedPurchase === ''
          ? undefined
          : debouncedFilters.verifiedPurchase,
    }),
    [debouncedFilters],
  );

  const reviewsQuery = useAdminReviews({
    enabled: activeSection === 'reviews' && !isDebouncing,
    params,
  });

  useEffect(() => {
    if (activeSection !== 'reviews') return;
    if (isDebouncing || reviewsQuery.isPlaceholderData) return;

    const pagination = reviewsQuery.pagination;

    if (!pagination) return;

    if (pagination.page !== page) {
      syncPage(pagination.page);
    }
  }, [
    activeSection,
    isDebouncing,
    page,
    reviewsQuery.isPlaceholderData,
    reviewsQuery.pagination,
    syncPage,
  ]);

  return {
    filters,
    moderationAction,
    onPageChange: handlePageChange,
    reviewsQuery,
  };
};

export type AdminReviewsSectionState = ReturnType<
  typeof useAdminReviewsSection
>;
