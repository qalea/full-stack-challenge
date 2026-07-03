'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'
import { NoteCardProps } from '@/utils/types'
import useNoteCard from './useNoteCard'
import IconButton from '@/components/atoms/IconButton'

const NoteCard: React.FC<NoteCardProps> = ({ note, isSelected = false, onClick, onDelete }) => {
  const { excerpt, formattedDate } = useNoteCard({ note })

  return (
    <div
      className={[
        'group relative w-full rounded-lg border transition-all',
        isSelected
          ? 'border-accent bg-accent-light shadow-card'
          : 'border-border bg-surface hover:border-accent/40 hover:shadow-card',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onClick}
        className={[
          'w-full p-3 pr-10 text-left',
          'focus-visible:ring-accent/30 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
        ].join(' ')}
      >
        <div className="flex flex-col gap-1.5">
          <p
            className={[
              'truncate text-sm font-semibold leading-tight',
              isSelected ? 'text-accent' : 'text-text-primary',
            ].join(' ')}
          >
            {note.title || 'Untitled'}
          </p>

          {excerpt ? (
            <p className="text-text-muted line-clamp-2 text-xs leading-relaxed">{excerpt}</p>
          ) : null}

          <div className="flex items-center justify-end pt-0.5">
            <span className="text-text-muted shrink-0 text-[10px]">{formattedDate}</span>
          </div>
        </div>
      </button>

      {onDelete ? (
        <IconButton
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label={`Delete ${note.title || 'note'}`}
          variant="danger"
          size="sm"
          onClick={onDelete}
          className="absolute right-1.5 top-1.5"
        />
      ) : null}
    </div>
  )
}

export default NoteCard
