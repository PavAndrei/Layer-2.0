import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAdminShippingSettings } from '../api';
import { syncAdminStoreSettingsQueries } from './admin-settings-cache';

export const useUpdateAdminShippingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminShippingSettings,
    onSuccess: (response) => {
      syncAdminStoreSettingsQueries(queryClient, response);
    },
  });
};
