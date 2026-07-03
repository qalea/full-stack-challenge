'use client'

import React from 'react'
import Button from '@/components/atoms/Button'
import { ConfirmDialogProps } from '@/utils/types'

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="border-border bg-surface shadow-panel relative z-10 w-full max-w-sm rounded-xl border p-6"
      >
        <h2 id="dialog-title" className="text-text-primary text-base font-semibold">
          {title}
        </h2>
        {description ? <p className="text-text-muted mt-1 text-sm">{description}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
