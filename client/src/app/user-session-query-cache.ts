import type { QueryClient } from '@tanstack/react-query';

import { orderQueryKeys } from '../entities/order';
import { reviewQueryKeys } from '../entities/review';
import { userQueryKeys } from '../entities/user';
import { favoritesQueryKeys } from '../features/favorites';

export const clearUserSessionQueryCache = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    queryKey: favoritesQueryKeys.all,
  });
  queryClient.removeQueries({
    queryKey: userQueryKeys.current(),
  });
  queryClient.removeQueries({
    queryKey: orderQueryKeys.all,
  });
  queryClient.removeQueries({
    queryKey: reviewQueryKeys.userScoped(),
  });
};
