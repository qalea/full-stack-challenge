'use client'

import React from 'react'
import { TextareaProps } from '@/utils/types'

const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={textareaId} className="text-text-primary text-sm font-medium">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={[
          'border-border bg-surface text-text-primary w-full rounded-md border px-3 py-2 text-sm',
          'placeholder:text-text-muted resize-none transition-colors',
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

export default Textarea
