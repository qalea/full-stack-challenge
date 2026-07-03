'use client'

import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { NoteWithTags } from '@notes/types'
import { useUpdateNoteQuery, useDeleteNoteQuery } from '@/hooks/useNotes'

interface UseNoteEditorFormProps {
  note: NoteWithTags
  onDeleted: () => void
}

const useNoteEditorForm = ({ note, onDeleted }: UseNoteEditorFormProps) => {
  const queryClientInstance = useQueryClient()

  const updateNoteQuery = useUpdateNoteQuery(note.id)
  const deleteNoteQuery = useDeleteNoteQuery()

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isDirty, setIsDirty] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setIsDirty(true)
  }, [])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(() => {
    updateNoteQuery.mutate({ title, content }, { onSuccess: () => setIsDirty(false) })
  }, [title, content, updateNoteQuery])

  const handleDeleteRequest = useCallback(() => setShowDeleteConfirm(true), [])
  const handleDeleteCancel = useCallback(() => setShowDeleteConfirm(false), [])

  const handleDeleteConfirm = useCallback(async () => {
    await deleteNoteQuery.mutateAsync(note.id)
    await queryClientInstance.refetchQueries({ queryKey: ['notes'] })
    onDeleted()
  }, [note.id, deleteNoteQuery, queryClientInstance, onDeleted])

  return {
    title,
    content,
    isDirty,
    isSaving: updateNoteQuery.isPending,
    isDeleting: deleteNoteQuery.isPending,
    saveError: updateNoteQuery.error,
    showDeleteConfirm,
    handleTitleChange,
    handleContentChange,
    handleSave,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  }
}

export default useNoteEditorForm
