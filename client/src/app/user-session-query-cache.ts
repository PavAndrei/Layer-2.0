import type { QueryClient } from '@tanstack/react-query';

import { favoritesQueryKeys } from '../features/favorites';
import { PROFILE_QUERY_KEYS } from '../features/profile';

export const clearUserSessionQueryCache = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    queryKey: favoritesQueryKeys.all,
  });
  queryClient.removeQueries({
    queryKey: PROFILE_QUERY_KEYS.profile,
  });
};
