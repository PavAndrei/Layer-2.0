import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminOrderSettings } from '../api';
import { syncAdminStoreSettingsQueries } from './admin-settings-cache';

export const useUpdateAdminOrderSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminOrderSettings,
    onSuccess: (response) => {
      syncAdminStoreSettingsQueries(queryClient, response);
    },
  });
};
