import { Link, useSearchParams } from 'react-router';

import { AuthLayout, ResetPasswordForm } from './ui';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  return (
    <AuthLayout
      title="Create new password"
      description="Choose a new password for your Layer account."
      form={<ResetPasswordForm token={token} />}
      footerText={
        <>
          Need another reset link?{' '}
          <Link
            to="/forgot-password"
            className="text-typography-heading underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Request one
          </Link>
        </>
      }
    />
  );
};
