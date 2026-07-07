import { Button, TextInput } from '../../../shared/ui';
import { useRegister } from '../model';
import { AuthMethodDivider } from './auth-method-divider';
import { GoogleAuthButton } from './google-auth-button';

export const RegisterForm = () => {
  const {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting,
    updateField,
    values,
  } = useRegister();

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <TextInput
        id="register-name"
        name="name"
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        error={fieldErrors.name}
        required
        value={values.name}
        onChange={(value) => updateField('name', value)}
      />

      <TextInput
        id="register-email"
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

      <TextInput
        id="register-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        error={fieldErrors.password}
        minLength={8}
        required
        value={values.password}
        onChange={(value) => updateField('password', value)}
      />

      <TextInput
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
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
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <AuthMethodDivider />
      <GoogleAuthButton />
    </form>
  );
};
