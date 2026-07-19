import type { OrderStatus } from '../../entities/order';
import { useOrders } from '../orders';
import {
  PROFILE_ORDERS_PAGE_LIMIT,
  type ProfileSection,
} from './model';

type UseProfileOrdersSectionParams = {
  activeOrderStatus?: OrderStatus;
  activeOrdersPage: number;
  activeSection: ProfileSection;
  onPageChange: (page: number) => void;
};

export const useProfileOrdersSection = ({
  activeOrderStatus,
  activeOrdersPage,
  activeSection,
  onPageChange,
}: UseProfileOrdersSectionParams) => {
  const ordersQuery = useOrders({
    enabled: activeSection === 'orders',
    params: {
      limit: PROFILE_ORDERS_PAGE_LIMIT,
      page: activeOrdersPage,
      status: activeOrderStatus,
    },
  });

  return {
    activeOrderStatus: activeOrderStatus ?? null,
    ordersQuery,
    onPageChange,
  };
};

export type ProfileOrdersSectionState = ReturnType<
  typeof useProfileOrdersSection
>;
