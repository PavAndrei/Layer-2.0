import { useCallback, useMemo } from 'react';

import {
  ORDER_PAYMENT_STATUSES,
  ORDER_STATUSES,
  type OrderPaymentStatus,
  type OrderStatus,
} from '../../../entities/order';
import { useDebouncedValue } from '../../../shared/hooks';
import {
  customParam,
  numberParam,
  stringParam,
  useUrlState,
  type UrlStateSetter,
} from '../../../shared/model';

export type AdminOrdersFilters = {
  page: number;
  paymentStatus: OrderPaymentStatus | '';
  search: string;
  status: OrderStatus | '';
  userId: string;
};

type AdminOrdersUrlState = AdminOrdersFilters & {
  section: string;
};

export type AdminOrdersFiltersState = AdminOrdersFilters & {
  clearUserFilter: () => void;
  debouncedFilters: AdminOrdersFilters;
  handlePageChange: (page: number) => void;
  handlePaymentStatusChange: (status: AdminOrdersFilters['paymentStatus']) => void;
  handleSearchChange: (search: string) => void;
  handleStatusChange: (status: AdminOrdersFilters['status']) => void;
  isDebouncing: boolean;
  resetFilters: () => void;
  syncPage: (page: number) => void;
};

export const initialAdminOrdersFilters: AdminOrdersFilters = {
  page: 1,
  paymentStatus: '',
  search: '',
  status: '',
  userId: '',
};

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const initialAdminOrdersUrlState: AdminOrdersUrlState = {
  ...initialAdminOrdersFilters,
  section: '',
};

const ADMIN_ORDERS_FILTERS_URL_SCHEMA = {
  section: stringParam({ name: 'section' }),
  search: stringParam({ name: 'search' }),
  userId: customParam<string>({
    parse: (searchParams) => {
      const userId = searchParams.get('userId') ?? '';

      return OBJECT_ID_PATTERN.test(userId) ? userId : '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('userId');
        return;
      }

      searchParams.set('userId', value);
    },
  }),
  status: customParam<AdminOrdersFilters['status']>({
    parse: (searchParams) => {
      const status = searchParams.get('status');

      return ORDER_STATUSES.find((orderStatus) => orderStatus === status) ?? '';
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('status');
        return;
      }

      searchParams.set('status', value);
    },
  }),
  paymentStatus: customParam<AdminOrdersFilters['paymentStatus']>({
    parse: (searchParams) => {
      const status = searchParams.get('paymentStatus');

      return (
        ORDER_PAYMENT_STATUSES.find(
          (paymentStatus) => paymentStatus === status,
        ) ?? ''
      );
    },
    serialize: (searchParams, value) => {
      if (!value) {
        searchParams.delete('paymentStatus');
        return;
      }

      searchParams.set('paymentStatus', value);
    },
  }),
  page: numberParam({
    name: 'page',
    defaultValue: initialAdminOrdersFilters.page,
    validate: (value) => Number.isInteger(value) && value > 0,
  }),
};

const toFilters = ({
  page,
  paymentStatus,
  search,
  status,
  userId,
}: AdminOrdersUrlState): AdminOrdersFilters => ({
  page,
  paymentStatus,
  search,
  status,
  userId,
});

export const useAdminOrdersFilters = (): AdminOrdersFiltersState => {
  const [urlState, setUrlState] = useUrlState<AdminOrdersUrlState>(
    ADMIN_ORDERS_FILTERS_URL_SCHEMA,
    { replace: true },
  );

  const filters = useMemo(() => toFilters(urlState), [urlState]);

  const setFilters = useCallback<UrlStateSetter<AdminOrdersFilters>>(
    (value, options) => {
      setUrlState((prev) => {
        const previousFilters = toFilters(prev);
        const nextFilters =
          typeof value === 'function'
            ? (value as (state: AdminOrdersFilters) => AdminOrdersFilters)(
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

  const debouncedFilters = useMemo<AdminOrdersFilters>(
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
        ...initialAdminOrdersUrlState,
        section: prev.section,
      }),
      { replace: true },
    );
  }, [setUrlState]);

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        search,
      }));
    },
    [setFilters],
  );

  const handleStatusChange = useCallback(
    (status: AdminOrdersFilters['status']) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        status,
      }));
    },
    [setFilters],
  );

  const handlePaymentStatusChange = useCallback(
    (paymentStatus: AdminOrdersFilters['paymentStatus']) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        paymentStatus,
      }));
    },
    [setFilters],
  );

  const clearUserFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      userId: '',
    }));
  }, [setFilters]);

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
      clearUserFilter,
      debouncedFilters,
      handlePageChange,
      handlePaymentStatusChange,
      handleSearchChange,
      handleStatusChange,
      isDebouncing,
      resetFilters,
      syncPage,
    }),
    [
      clearUserFilter,
      debouncedFilters,
      filters,
      handlePageChange,
      handlePaymentStatusChange,
      handleSearchChange,
      handleStatusChange,
      isDebouncing,
      resetFilters,
      syncPage,
    ],
  );
};
