import { useCallback, useMemo } from 'react';

import { useDebouncedValue } from '../../../shared/hooks';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';

export type AdminReviewsFilters = {
  page: number;
  rating: number | '';
  search: string;
  verifiedPurchase: true | '';
};

type AdminReviewsUrlState = AdminReviewsFilters & {
  section: string;
};

export type AdminReviewsFiltersState = AdminReviewsFilters & {
  debouncedFilters: AdminReviewsFilters;
  handlePageChange: (page: number) => void;
  handleRatingChange: (rating: AdminReviewsFilters['rating']) => void;
  handleSearchChange: (search: string) => void;
  handleVerifiedPurchaseChange: (
    verifiedPurchase: AdminReviewsFilters['verifiedPurchase'],
  ) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminReviewsFilters: AdminReviewsFilters = {
  page: 1,
  rating: '',
  search: '',
  verifiedPurchase: '',
};

const initialAdminReviewsUrlState: AdminReviewsUrlState = {
  ...initialAdminReviewsFilters,
  section: '',
};

const ADMIN_REVIEWS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  search: stringParam({ name: 'search' }),
  rating: customParam<AdminReviewsFilters['rating']>({
    parse: (searchParams) => {
      const rating = Number(searchParams.get('rating'));

      return Number.isInteger(rating) && rating >= 1 && rating <= 5
        ? rating
        : '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('rating');
        return;
      }

      searchParams.set('rating', String(value));
    },
  }),
  verifiedPurchase: customParam<AdminReviewsFilters['verifiedPurchase']>({
    parse: (searchParams) => {
      const verifiedPurchase = searchParams.get('verifiedPurchase');

      return verifiedPurchase === 'true' ? true : '';
    },
    serialize: (searchParams, value) => {
      if (value !== true) {
        searchParams.delete('verifiedPurchase');
        return;
      }

      searchParams.set('verifiedPurchase', 'true');
    },
  }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminReviewsFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  page,
  rating,
  search,
  verifiedPurchase,
}: AdminReviewsUrlState): AdminReviewsFilters => ({
  page,
  rating,
  search,
  verifiedPurchase,
});

export const useAdminReviewsFilters = (): AdminReviewsFiltersState => {
  const [urlState, setUrlState] = useUrlState<AdminReviewsUrlState>(
    ADMIN_REVIEWS_FILTERS_URL_SCHEMA,
    { replace: true },
  );

  const filters = useMemo(() => toFilters(urlState), [urlState]);

  const setFilters = useCallback<UrlStateSetter<AdminReviewsFilters>>(
    (value, options) => {
      setUrlState((prev) => {
        const previousFilters = toFilters(prev);
        const nextFilters =
          typeof value === 'function'
            ? (value as (state: AdminReviewsFilters) => AdminReviewsFilters)(
              previousFilters,
            )
            : value;

        return {
          ...prev,
          ...nextFilters,
        };
      }, options);
    },
    [setUrlState],
  );

  const debouncedSearch = useDebouncedValue(filters.search, 400);

  const debouncedFilters = useMemo<AdminReviewsFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters],
  );

  const isDebouncing = filters.search !== debouncedSearch;

  const resetFilters = useCallback(() => {
    setUrlState(
      (prev) => ({
        ...initialAdminReviewsUrlState,
        section: prev.section,
      }),
      { replace: true },
    );
  }, [setUrlState]);

  const updateFilter = useCallback(
    <Key extends keyof AdminReviewsFilters>(
      field: Key,
      value: AdminReviewsFilters[Key],
    ) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [field]: value,
      }));
    },
    [setFilters],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters(
        (prev) => ({
          ...prev,
          page,
        }),
        { replace: false },
      );
    },
    [setFilters],
  );

  const syncPage = useCallback(
    (page: number) => {
      setFilters((prev) => ({
        ...prev,
        page,
      }));
    },
    [setFilters],
  );

  return useMemo(
    () => ({
      ...filters,
      debouncedFilters,
      handlePageChange,
      handleRatingChange: (rating: AdminReviewsFilters['rating']) =>
        updateFilter('rating', rating),
      handleSearchChange: (search: string) =>
        updateFilter('search', search),
      handleVerifiedPurchaseChange: (
        verifiedPurchase: AdminReviewsFilters['verifiedPurchase'],
      ) => updateFilter('verifiedPurchase', verifiedPurchase),
      isDebouncing,
      resetFilters,
      syncPage,
    }),
    [
      debouncedFilters,
      filters,
      handlePageChange,
      isDebouncing,
      resetFilters,
      syncPage,
      updateFilter,
    ],
  );
};
