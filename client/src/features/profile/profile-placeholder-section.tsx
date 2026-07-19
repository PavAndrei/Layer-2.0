import { FeedbackMessage } from '../../shared/ui';
import {
  PROFILE_SECTION_LABELS,
  type ProfileSection,
} from './model';
import { ProfileSectionHeader } from './ui';

const placeholderDescriptions: Record<
  Exclude<ProfileSection, 'orders' | 'profile' | 'reviews' | 'security'>,
  string
> = {
  favorites: 'Your saved products will appear here.',
};

type ProfilePlaceholderSectionProps = {
  activeSection: Exclude<
    ProfileSection,
    'orders' | 'profile' | 'reviews' | 'security'
  >;
};

export const ProfilePlaceholderSection = ({
  activeSection,
}: ProfilePlaceholderSectionProps) => {
  return (
    <>
      <ProfileSectionHeader
        title={PROFILE_SECTION_LABELS[activeSection]}
        description={placeholderDescriptions[activeSection]}
      />
      <FeedbackMessage
        title={`${PROFILE_SECTION_LABELS[activeSection]} coming soon`}
        description="This account section is prepared and will be connected next."
      />
    </>
  );
};
