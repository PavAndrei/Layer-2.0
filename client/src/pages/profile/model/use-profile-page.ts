import { useQueryClient } from '@tanstack/react-query';

import {
  setAuthBootstrapUserQueryData,
  useAuthStore,
} from '../../../features/auth';
import { useProfile, useProfilePageState } from '../../../features/profile';
import { useUpdateProfile } from '../../../features/profile';
import { useProfileEmailVerification } from './use-profile-email-verification';
import { useProfileOrdersSection } from './use-profile-orders-section';
import { useProfileReviewsSection } from './use-profile-reviews-section';

export const useProfilePage = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    activeOrderStatus,
    activeOrdersPage,
    activeReviewsPage,
    activeSection,
    handleOrdersPageChange,
    handleReviewsPageChange,
  } = useProfilePageState();
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile({
    onUserUpdated: (user) => {
      setUser(user);
      setAuthBootstrapUserQueryData(queryClient, user);
    },
  });
  const emailVerification = useProfileEmailVerification();
  const ordersSection = useProfileOrdersSection({
    activeOrderStatus,
    activeOrdersPage,
    activeSection,
    onPageChange: handleOrdersPageChange,
  });
  const reviewsSection = useProfileReviewsSection({
    activeReviewsPage,
    activeSection,
    onPageChange: handleReviewsPageChange,
  });

  return {
    activeSection,
    emailVerification,
    ordersSection,
    profileQuery,
    reviewsSection,
    updateProfileMutation,
  };
};
