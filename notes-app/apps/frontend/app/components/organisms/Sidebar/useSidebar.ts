'use client'

import { useState, useCallback } from 'react'
import { UseSidebarProps } from '@/utils/types'
import { useGetNotesQuery, useDeleteNoteQuery } from '@/hooks/useNotes'

const useSidebar = ({ onSelectNote, onNoteDeleted, selectedNoteId }: UseSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const {
    data: notesData,
    isLoading: notesLoading,
    refetch,
  } = useGetNotesQuery(searchQuery || undefined)

  const deleteNoteQuery = useDeleteNoteQuery()

  const notes = notesData?.notes ?? []

  const handleSearch = useCallback((value: string) => setSearchQuery(value), [])

  const handleDeleteRequest = useCallback((noteId: string) => {
    setNoteToDelete(noteId)
  }, [])

  const handleDeleteCancel = useCallback(() => setNoteToDelete(null), [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!noteToDelete) return

    await deleteNoteQuery.mutateAsync(noteToDelete)
    await refetch()

    if (noteToDelete === selectedNoteId) {
      onNoteDeleted?.()
    }
    setNoteToDelete(null)
  }, [noteToDelete, selectedNoteId, deleteNoteQuery, refetch, onNoteDeleted])

  const notePendingDelete = notes.find((note) => note.id === noteToDelete)

  return {
    notes,
    notesLoading,
    searchQuery,
    selectedNoteId,
    noteToDelete,
    notePendingDelete,
    isDeleting: deleteNoteQuery.isPending,
    handleSearch,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    onSelectNote,
  }
}

export default useSidebar
