import { useParams } from 'react-router';

import { formatDisplayDate } from '../../shared/lib';
import { useOrder } from './model';

const getOrderNumber = (orderId: string) => {
  return orderId.slice(-8).toUpperCase();
};

export const useOrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const orderQuery = useOrder({ orderId });
  const order = orderQuery.order;

  return {
    error: orderQuery.error,
    isFetching: orderQuery.isFetching,
    isLoading: orderQuery.isLoading,
    order,
    orderNumber: order ? getOrderNumber(order._id) : null,
    placedAt: order ? formatDisplayDate(order.createdAt) : null,
    refetch: orderQuery.refetch,
  };
};
