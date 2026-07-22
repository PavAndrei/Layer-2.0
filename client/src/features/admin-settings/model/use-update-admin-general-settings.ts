import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminGeneralSettings } from '../api';
import { syncAdminStoreSettingsQueries } from './admin-settings-cache';

export const useUpdateAdminGeneralSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminGeneralSettings,
    onSuccess: (response) => {
      syncAdminStoreSettingsQueries(queryClient, response);
    },
  });
};
