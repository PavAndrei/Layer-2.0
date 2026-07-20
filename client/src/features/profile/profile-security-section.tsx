import { SectionHeader } from '../../shared/ui';
import { ProfileEmailVerification } from './ui';

type ProfileSecuritySectionProps = {
  emailVerification: {
    error: string | null;
    isPending: boolean;
    isSuccess: boolean;
    requestEmailVerification: () => void;
    resendAvailableInSeconds: number;
  };
  isEmailVerified: boolean;
};

export const ProfileSecuritySection = ({
  emailVerification,
  isEmailVerified,
}: ProfileSecuritySectionProps) => {
  return (
    <>
      <SectionHeader
        title="Security"
        description="Manage account verification and security settings."
      />
      <ProfileEmailVerification
        error={emailVerification.error}
        isEmailVerified={isEmailVerified}
        isPending={emailVerification.isPending}
        isSuccess={emailVerification.isSuccess}
        resendAvailableInSeconds={
          emailVerification.resendAvailableInSeconds
        }
        onRequest={emailVerification.requestEmailVerification}
      />
    </>
  );
};
