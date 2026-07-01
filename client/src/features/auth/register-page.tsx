import { Link } from 'react-router';

import { REGISTER_BENEFITS } from './model';
import { AuthLayout, RegisterForm } from './ui';

export const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create account"
      description="Join Layer to save favorites and manage your profile."
      benefits={REGISTER_BENEFITS}
      form={<RegisterForm />}
      footerText={
        <>
          Already have an account?{' '}
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
