import type { User } from '../../entities/user';
import { SectionHeader } from '../../shared/ui';
import { ProfileDetails } from './ui';

type ProfileDetailsSectionProps = {
  user: User;
};

export const ProfileDetailsSection = ({
  user,
}: ProfileDetailsSectionProps) => {
  return (
    <>
      <SectionHeader
        title="Profile"
        description="Review your account details."
      />
      <ProfileDetails user={user} />
    </>
  );
};
