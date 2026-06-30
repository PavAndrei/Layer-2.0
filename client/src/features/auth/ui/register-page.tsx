import { Link } from 'react-router';

export const RegisterPage = () => {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="heading-2 text-typography-heading">
            Create account
          </h1>
          <p className="block-medium text-typography-secondary">
            Join Layer to save favorites and manage your profile.
          </p>
        </div>

        <div className="border-y border-border-strong py-6">
          <p className="block-medium text-typography-secondary">
            Register form will be added here.
          </p>
        </div>

        <p className="block-small text-typography-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-typography-heading underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};
