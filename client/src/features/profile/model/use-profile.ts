import { useQuery } from '@tanstack/react-query';

import { getProfile } from '../api';
import { PROFILE_QUERY_KEYS } from './profile-query-keys';

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.profile,
    queryFn: getProfile,
    retry: false,
  });
};
