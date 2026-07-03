'use client'

import React from 'react'
import { ButtonProps } from '@/utils/types'

type Variant = NonNullable<ButtonProps['variant']>
type Size = NonNullable<ButtonProps['size']>

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent/50 disabled:bg-accent/50',
  secondary:
    'bg-surface border border-border text-text-primary hover:bg-surface-muted disabled:opacity-50',
  danger:
    'bg-danger text-white hover:bg-danger-hover focus-visible:ring-2 focus-visible:ring-danger/50 disabled:bg-danger/50',
  ghost:
    'bg-transparent text-text-muted hover:bg-surface-muted hover:text-text-primary disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}) => (
  <button
    disabled={disabled || isLoading}
    className={[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')}
    {...props}
  >
    {isLoading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : null}
    {children}
  </button>
)

export default Button
