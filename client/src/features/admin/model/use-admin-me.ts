import { useQuery } from '@tanstack/react-query';

import { getAdminMe } from '../api';
import { adminQueryKeys } from './admin-query-keys';

export const useAdminMe = () => {
  return useQuery({
    queryKey: adminQueryKeys.me(),
    queryFn: getAdminMe,
    retry: false,
  });
};
