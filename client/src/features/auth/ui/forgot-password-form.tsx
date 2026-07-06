import { Button, FeedbackMessage, TextInput } from '../../../shared/ui';
import { useForgotPassword } from '../model';

export const ForgotPasswordForm = () => {
  const {
    error,
    fieldErrors,
    handleSubmit,
    isCooldownActive,
    isSubmitting,
    isSuccess,
    resendAvailableInSeconds,
    updateField,
    values,
  } = useForgotPassword();

  const isSubmitDisabled = isSubmitting || isCooldownActive;
  const submitLabel = isSubmitting
    ? 'Sending link...'
    : isCooldownActive
      ? `Send again in ${resendAvailableInSeconds}s`
      : isSuccess
        ? 'Send again'
        : 'Send reset link';

  return (
    <div className="space-y-4">
      {isSuccess && (
        <FeedbackMessage
          title="Check your email"
          description="If an account exists for this email, a password reset link has been sent."
        />
      )}

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <TextInput
          id="forgot-password-email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={fieldErrors.email}
          required
          value={values.email}
          onChange={(value) => updateField('email', value)}
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
          disabled={isSubmitDisabled}
        >
          {submitLabel}
        </Button>
      </form>
    </div>
  );
};
