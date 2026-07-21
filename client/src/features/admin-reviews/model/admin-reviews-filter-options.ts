import type { SelectFilterOption } from '../../../shared/ui';
import type { AdminReviewsFilters } from './use-admin-reviews-filters';

export type AdminReviewRatingFilterValue = AdminReviewsFilters['rating'];
export type AdminReviewRatingFilterOption =
  SelectFilterOption<AdminReviewRatingFilterValue>;

export const ADMIN_REVIEW_RATING_FILTER_OPTIONS: readonly AdminReviewRatingFilterOption[] = [
  { label: 'All ratings', value: '' },
  { label: '5 stars', value: 5 },
  { label: '4 stars', value: 4 },
  { label: '3 stars', value: 3 },
  { label: '2 stars', value: 2 },
  { label: '1 star', value: 1 },
];
