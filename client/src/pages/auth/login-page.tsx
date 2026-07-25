import { Link } from 'react-router';

import {
  AuthLayout,
  LOGIN_BENEFITS,
  LoginForm,
} from '../../features/auth';

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Sign in"
      description="Access your account, saved items, and future orders."
      benefits={LOGIN_BENEFITS}
      form={<LoginForm />}
      footerText={
        <>
          New to Layer?{' '}
          <Link
            to="/register"
            className="text-typography-heading underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Create an account
          </Link>
        </>
      }
    />
  );
};
