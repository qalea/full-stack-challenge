'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { SearchBarProps } from '@/utils/types'
import useSearchBar from './useSearchBar'

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search notes…' }) => {
  const { inputValue, handleChange, handleClear } = useSearchBar({ onSearch })

  return (
    <div className="relative flex items-center">
      <Search className="text-text-muted pointer-events-none absolute left-2.5 h-4 w-4" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={[
          'border-border bg-surface text-text-primary w-full rounded-md border py-2 pl-9 pr-8 text-sm',
          'placeholder:text-text-muted transition-colors',
          'focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:outline-none focus-visible:ring-2',
        ].join(' ')}
      />
      {inputValue ? (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="text-text-muted hover:text-text-primary absolute right-2.5 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export default SearchBar
