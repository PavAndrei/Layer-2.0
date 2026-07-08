import { useQuery } from '@tanstack/react-query';

import { userQueryKeys } from '../../../entities/user';
import { getProfile } from '../api';

export const useProfile = () => {
  return useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: getProfile,
    retry: false,
  });
};
