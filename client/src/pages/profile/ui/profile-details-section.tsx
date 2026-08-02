import type { User } from '../../../entities/user';
import { SectionHeader } from '../../../shared/ui';
import { ProfileDetails } from '../../../features/profile';
import type { useProfilePage } from '../model';

type ProfileDetailsSectionProps = {
  updateProfileMutation: ReturnType<
    typeof useProfilePage
  >['updateProfileMutation'];
  user: User;
};

export const ProfileDetailsSection = ({
  updateProfileMutation,
  user,
}: ProfileDetailsSectionProps) => {
  const mutationError =
    updateProfileMutation.data && !updateProfileMutation.data.success
      ? updateProfileMutation.data.message
      : updateProfileMutation.error instanceof Error
        ? updateProfileMutation.error.message
        : null;
  const successMessage =
    updateProfileMutation.data?.success
      ? updateProfileMutation.data.message
      : null;

  return (
    <>
      <SectionHeader
        title="Profile"
        description="Review your account details."
      />
      <ProfileDetails
        error={mutationError}
        isSubmitting={updateProfileMutation.isPending}
        successMessage={successMessage}
        user={user}
        onSubmit={(payload) => updateProfileMutation.mutate(payload)}
      />
    </>
  );
};
