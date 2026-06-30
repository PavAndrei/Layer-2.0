import { Link } from 'react-router';

export const LoginPage = () => {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="heading-2 text-typography-heading">Sign in</h1>
          <p className="block-medium text-typography-secondary">
            Access your account, saved items, and future orders.
          </p>
        </div>

        <div className="border-y border-border-strong py-6">
          <p className="block-medium text-typography-secondary">
            Login form will be added here.
          </p>
        </div>

        <p className="block-small text-typography-secondary">
          New to Layer?{' '}
          <Link
            to="/register"
            className="text-typography-heading underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};
