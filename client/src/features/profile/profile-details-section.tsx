import type { User } from '../../entities/user';
import { ProfileDetails, ProfileSectionHeader } from './ui';

type ProfileDetailsSectionProps = {
  user: User;
};

export const ProfileDetailsSection = ({
  user,
}: ProfileDetailsSectionProps) => {
  return (
    <>
      <ProfileSectionHeader
        title="Profile"
        description="Review your account details."
      />
      <ProfileDetails user={user} />
    </>
  );
};
