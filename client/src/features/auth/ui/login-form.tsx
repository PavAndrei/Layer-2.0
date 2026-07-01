import { Button, TextInput } from '../../../shared/ui';
import { useLogin } from '../model';

export const LoginForm = () => {
  const {
    error,
    fieldErrors,
    handleSubmit,
    isSubmitting,
    updateField,
    values,
  } =
    useLogin();

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <TextInput
        id="login-email"
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
        id="login-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={fieldErrors.password}
        required
        value={values.password}
        onChange={(value) => updateField('password', value)}
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
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
