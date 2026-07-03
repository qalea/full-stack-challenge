'use client'

import { useState, useCallback } from 'react'

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const confirm = useCallback(
    (onConfirm: () => void) => () => {
      onConfirm()
      close()
    },
    [close],
  )

  return { isOpen, open, close, confirm }
}

export default useConfirmDialog
