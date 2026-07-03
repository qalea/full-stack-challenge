'use client'

import { useState, useEffect, useCallback } from 'react'
import { UseSearchBarProps } from '@/utils/types'

const DEBOUNCE_MS = 300

const useSearchBar = ({ onSearch, initialValue = '' }: UseSearchBarProps) => {
  const [inputValue, setInputValue] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue, onSearch])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setInputValue('')
  }, [])

  return { inputValue, handleChange, handleClear }
}

export default useSearchBar
