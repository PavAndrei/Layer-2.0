import { useCallback, useMemo } from 'react';

import {
  REVIEW_STATUSES,
  type ReviewStatus,
} from '../../../entities/review';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';

export type AdminReviewsFilters = {
  dateFrom: string;
  dateTo: string;
  page: number;
  productId: string;
  rating: number | '';
  status: ReviewStatus | '';
  verifiedPurchase: boolean | '';
};

type AdminReviewsUrlState = AdminReviewsFilters & {
  section: string;
};

export type AdminReviewsFiltersState = AdminReviewsFilters & {
  debouncedFilters: AdminReviewsFilters;
  handleDateFromChange: (dateFrom: string) => void;
  handleDateToChange: (dateTo: string) => void;
  handlePageChange: (page: number) => void;
  handleProductIdChange: (productId: string) => void;
  handleRatingChange: (rating: AdminReviewsFilters['rating']) => void;
  handleStatusChange: (status: AdminReviewsFilters['status']) => void;
  handleVerifiedPurchaseChange: (
    verifiedPurchase: AdminReviewsFilters['verifiedPurchase'],
  ) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminReviewsFilters: AdminReviewsFilters = {
  dateFrom: '',
  dateTo: '',
  page: 1,
  productId: '',
  rating: '',
  status: '',
  verifiedPurchase: '',
};

const initialAdminReviewsUrlState: AdminReviewsUrlState = {
  ...initialAdminReviewsFilters,
  section: '',
};

const ADMIN_REVIEWS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  status: customParam<AdminReviewsFilters['status']>({
    parse: (searchParams) => {
      const status = searchParams.get('status');

      return REVIEW_STATUSES.find((reviewStatus) => reviewStatus === status) ??
        '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('status');
        return;
      }

      searchParams.set('status', value);
    },
  }),
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
  productId: stringParam({ name: 'productId' }),
  verifiedPurchase: customParam<AdminReviewsFilters['verifiedPurchase']>({
    parse: (searchParams) => {
      const verifiedPurchase = searchParams.get('verifiedPurchase');

      if (verifiedPurchase !== 'true' && verifiedPurchase !== 'false') {
        return '';
      }

      return verifiedPurchase === 'true';
    },
    serialize: (searchParams, value) => {
      if (value === '') {
        searchParams.delete('verifiedPurchase');
        return;
      }

      searchParams.set('verifiedPurchase', String(value));
    },
  }),
  dateFrom: stringParam({ name: 'dateFrom' }),
  dateTo: stringParam({ name: 'dateTo' }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminReviewsFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  dateFrom,
  dateTo,
  page,
  productId,
  rating,
  status,
  verifiedPurchase,
}: AdminReviewsUrlState): AdminReviewsFilters => ({
  dateFrom,
  dateTo,
  page,
  productId,
  rating,
  status,
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
      debouncedFilters: filters,
      handleDateFromChange: (dateFrom: string) =>
        updateFilter('dateFrom', dateFrom),
      handleDateToChange: (dateTo: string) =>
        updateFilter('dateTo', dateTo),
      handlePageChange,
      handleProductIdChange: (productId: string) =>
        updateFilter('productId', productId),
      handleRatingChange: (rating: AdminReviewsFilters['rating']) =>
        updateFilter('rating', rating),
      handleStatusChange: (status: AdminReviewsFilters['status']) =>
        updateFilter('status', status),
      handleVerifiedPurchaseChange: (
        verifiedPurchase: AdminReviewsFilters['verifiedPurchase'],
      ) => updateFilter('verifiedPurchase', verifiedPurchase),
      isDebouncing: false,
      resetFilters,
      syncPage,
    }),
    [filters, handlePageChange, resetFilters, syncPage, updateFilter],
  );
};
