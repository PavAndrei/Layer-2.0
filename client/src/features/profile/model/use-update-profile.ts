import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userQueryKeys } from '../../../entities/user';
import type { User } from '../../../entities/user';
import { updateProfile } from '../api';

type UseUpdateProfileOptions = {
  onUserUpdated?: (user: User) => void;
};

export const useUpdateProfile = (
  options: UseUpdateProfileOptions = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      if (!response.success) return;

      queryClient.setQueryData(
        userQueryKeys.current(),
        response,
      );
      options.onUserUpdated?.(response.data.user);
    },
  });
};
