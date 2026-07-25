import { useId, useRef } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { Button } from './button';

type FileUploadFieldProps = {
  accept?: InputHTMLAttributes<HTMLInputElement>['accept'];
  buttonLabel?: string;
  className?: string;
  clearLabel?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label: string;
  name?: string;
  onFileChange: (file: File | null) => void;
  value?: File | null;
};

export const FileUploadField = ({
  accept,
  buttonLabel = 'Choose file',
  className = '',
  clearLabel = 'Remove',
  disabled = false,
  error,
  helperText,
  label,
  name,
  onFileChange,
  value,
}: FileUploadFieldProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    onFileChange(null);
  };

  return (
    <div className={['flex flex-col gap-2', className].join(' ')}>
      <label
        className="block-small text-typography-primary"
        htmlFor={inputId}
      >
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={inputId}
          accept={accept}
          className="sr-only"
          disabled={disabled}
          name={name}
          type="file"
          onChange={handleChange}
        />
        <Button
          disabled={disabled}
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </Button>
        {value && (
          <Button
            disabled={disabled}
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleClear}
          >
            {clearLabel}
          </Button>
        )}
      </div>

      {value && (
        <p className="block-small text-typography-secondary">{value.name}</p>
      )}
      {helperText && !error && (
        <p className="block-small text-typography-secondary">{helperText}</p>
      )}
      {error && <p className="block-small text-accent-secondary">{error}</p>}
    </div>
  );
};
