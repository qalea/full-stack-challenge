'use client'

import React from 'react'
import { IconButtonProps } from '@/utils/types'

type IconButtonVariant = NonNullable<IconButtonProps['variant']>

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'text-text-muted hover:text-text-primary hover:bg-surface-muted',
  danger: 'text-danger hover:bg-danger-light',
}

const sizeClasses = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => (
  <button
    aria-label={label}
    title={label}
    className={[
      'inline-flex items-center justify-center rounded-md transition-colors',
      'focus-visible:ring-accent/30 focus-visible:outline-none focus-visible:ring-2',
      'disabled:cursor-not-allowed disabled:opacity-40',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')}
    {...props}
  >
    {icon}
  </button>
)

export default IconButton
