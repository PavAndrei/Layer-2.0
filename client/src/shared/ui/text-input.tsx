import { useState, type InputHTMLAttributes } from 'react';

import { EyeIcon } from './eye-icon';
import { EyeOffIcon } from './eye-off-icon';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  error?: string;
  id: string;
  label: string;
  onChange?: (value: string) => void;
};

export const TextInput = ({
  disabled,
  error,
  id,
  label,
  className = '',
  onChange,
  type = 'text',
  ...props
}: TextInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordInput = type === 'password';
  const inputType = isPasswordInput && isPasswordVisible ? 'text' : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="block-medium text-typography-heading" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={[
            'min-h-11 w-full rounded border bg-background-surface px-3 py-2 block-medium text-typography-primary outline-none transition-colors placeholder:text-typography-muted focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60',
            isPasswordInput ? 'pr-11' : '',
            error ? 'border-red-600' : 'border-border-strong',
            className,
          ].join(' ')}
          data-password-input={isPasswordInput ? 'true' : undefined}
          disabled={disabled}
          id={id}
          type={inputType}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {isPasswordInput && (
          <button
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-typography-muted transition-colors hover:text-typography-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? (
              <EyeOffIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="block-small text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
