import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    );

    const variantStyles = {
      primary: clsx(
        'bg-primary-600 text-white',
        'hover:bg-primary-700',
        'focus-visible:ring-primary-500',
        'active:bg-primary-800'
      ),
      secondary: clsx(
        'bg-neutral-200 text-neutral-900',
        'hover:bg-neutral-300',
        'focus-visible:ring-neutral-500',
        'active:bg-neutral-400'
      ),
      ghost: clsx(
        'bg-transparent text-neutral-700',
        'hover:bg-neutral-100',
        'focus-visible:ring-neutral-500',
        'active:bg-neutral-200'
      ),
      danger: clsx(
        'bg-error-500 text-white',
        'hover:bg-error-600',
        'focus-visible:ring-error-500',
        'active:bg-error-700'
      ),
    };

    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
