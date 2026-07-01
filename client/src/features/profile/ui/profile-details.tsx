import type { User } from '../../auth';

type ProfileDetailsProps = {
  user: User;
};

const getEmailVerificationLabel = (isEmailVerified: boolean) => {
  return isEmailVerified ? 'Verified' : 'Not verified yet';
};

export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  return (
    <section className="grid gap-4 border-y border-border-strong py-6 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Name</span>
        <span className="block-medium text-typography-heading">
          {user.name}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Email</span>
        <span className="block-medium break-all text-typography-heading">
          {user.email}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">Role</span>
        <span className="block-medium capitalize text-typography-heading">
          {user.role}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="block-small text-typography-secondary">
          Email status
        </span>
        <span className="block-medium text-typography-heading">
          {getEmailVerificationLabel(user.isEmailVerified)}
        </span>
      </div>
    </section>
  );
};
