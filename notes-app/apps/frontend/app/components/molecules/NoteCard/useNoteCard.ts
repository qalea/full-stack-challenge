'use client'

import { UseNoteCardProps } from '@/utils/types'

const EXCERPT_LENGTH = 100

const useNoteCard = ({ note }: UseNoteCardProps) => {
  const excerpt =
    note.content.length > EXCERPT_LENGTH
      ? note.content.slice(0, EXCERPT_LENGTH).trimEnd() + '…'
      : note.content

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(note.updatedAt))

  return { excerpt, formattedDate }
}

export default useNoteCard
