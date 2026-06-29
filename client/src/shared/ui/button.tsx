import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-accent-primary bg-accent-primary text-background-surface hover:border-accent-hover hover:bg-accent-hover',
  secondary:
    'border-border-strong bg-background-surface text-typography-primary hover:bg-background-secondary',
  ghost:
    'border-transparent bg-transparent text-typography-secondary hover:bg-background-secondary hover:text-typography-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  icon: 'h-10 w-10 p-2',
  sm: 'min-h-8 px-3 py-1.5 block-small',
  md: 'min-h-10 px-4 py-2 block-medium',
};

export const Button = ({
  children,
  className = '',
  disabled,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={[
        'inline-flex w-fit cursor-pointer items-center justify-center rounded border transition-[color,background-color,border-color,transform] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};
