import { Link } from 'react-router';

import { AuthLayout, ForgotPasswordForm } from './ui';

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout
      title="Reset password"
      description="Enter your account email and we will send a reset link if the account exists."
      form={<ForgotPasswordForm />}
      footerText={
        <>
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-typography-heading underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Sign in
          </Link>
        </>
      }
    />
  );
};
