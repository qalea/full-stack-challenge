'use client'

import React from 'react'
import { Save, Trash2, AlertCircle } from 'lucide-react'
import { NoteEditorProps } from '@/utils/types'
import { useGetNoteQuery } from '@/hooks/useNotes'
import useNoteEditorForm from './useNoteEditor'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import Spinner from '@/components/atoms/Spinner'
import ConfirmDialog from '@/components/molecules/ConfirmDialog'

const NoteEditorForm: React.FC<{
  note: NonNullable<ReturnType<typeof useGetNoteQuery>['data']>
  onDeleted: () => void
}> = ({ note, onDeleted }) => {
  const {
    title,
    content,
    isDirty,
    isSaving,
    isDeleting,
    saveError,
    showDeleteConfirm,
    handleTitleChange,
    handleContentChange,
    handleSave,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useNoteEditorForm({ note, onDeleted })

  return (
    <>
      <div className="bg-surface flex h-full flex-col">
        <div className="border-border flex items-center justify-end gap-2 border-b px-6 py-3">
          {saveError ? (
            <span className="text-danger flex items-center gap-1 text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              Save failed
            </span>
          ) : null}
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={handleDeleteRequest}
            aria-label="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
          <Button size="sm" isLoading={isSaving} disabled={!isDirty} onClick={handleSave}>
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title…"
            className="border-none bg-transparent px-0 text-xl font-semibold shadow-none focus-visible:border-transparent focus-visible:ring-0"
            aria-label="Note title"
          />
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing…"
            className="min-h-[400px] flex-1 border-none bg-transparent px-0 text-sm leading-relaxed shadow-none focus-visible:border-transparent focus-visible:ring-0"
            aria-label="Note content"
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete this note?"
        description="This action cannot be undone. The note will be permanently deleted."
        confirmLabel="Delete note"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId, onDeleted }) => {
  const { data: note, isLoading, isError } = useGetNoteQuery(noteId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !note) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <AlertCircle className="text-danger h-8 w-8" />
        <p className="text-text-primary text-sm font-semibold">Failed to load note</p>
        <p className="text-text-muted text-xs">Try selecting the note again from the sidebar.</p>
      </div>
    )
  }

  return <NoteEditorForm key={note.id} note={note} onDeleted={onDeleted} />
}

export default NoteEditor
