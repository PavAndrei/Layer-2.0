import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    'border-accent-secondary bg-accent-secondary text-background-surface hover:border-accent-primary hover:bg-accent-primary',
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  disabled,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      className={[
        'inline-flex w-fit cursor-pointer items-center justify-center rounded border transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
