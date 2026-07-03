'use client'

import React from 'react'
import { InputProps } from '@/utils/types'

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-text-primary text-sm font-medium">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={[
          'border-border bg-surface text-text-primary w-full rounded-md border px-3 py-2 text-sm',
          'placeholder:text-text-muted transition-colors',
          'focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:outline-none focus-visible:ring-2',
          error ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/20' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  )
}

export default Input
