import { Link } from 'react-router';

import { Button, FeedbackMessage, TextInput } from '../../../shared/ui';
import { useResetPassword } from '../model';

type ResetPasswordFormProps = {
  token: string;
};

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting,
    isSuccess,
    updateField,
    values,
  } = useResetPassword(token);

  if (!token) {
    return (
      <FeedbackMessage
        tone="danger"
        title="Reset link is invalid"
        description="Open the latest password reset link from your email or request a new one."
        action={
          <Link
            to="/forgot-password"
            className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
          >
            Request a new link
          </Link>
        }
      />
    );
  }

  if (isSuccess) {
    return (
      <FeedbackMessage
        title="Password updated"
        description="Your password has been reset. Sign in with your new password."
        action={
          <Link
            to="/login"
            className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
          >
            Sign in
          </Link>
        }
      />
    );
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <TextInput
        id="reset-password-password"
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a new password"
        error={fieldErrors.password}
        minLength={8}
        required
        value={values.password}
        onChange={(value) => updateField('password', value)}
      />

      <TextInput
        id="reset-password-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your new password"
        error={fieldErrors.confirmPassword}
        minLength={8}
        required
        value={values.confirmPassword}
        onChange={(value) => updateField('confirmPassword', value)}
      />

      {error && (
        <p className="block-small text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating password...' : 'Reset password'}
      </Button>
    </form>
  );
};
