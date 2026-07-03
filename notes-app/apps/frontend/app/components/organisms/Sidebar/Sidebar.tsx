'use client'

import React from 'react'
import { StickyNote, Plus } from 'lucide-react'
import { SidebarProps } from '@/utils/types'
import useSidebar from './useSidebar'
import SearchBar from '@/components/molecules/SearchBar'
import NoteCard from '@/components/molecules/NoteCard'
import ConfirmDialog from '@/components/molecules/ConfirmDialog'
import Spinner from '@/components/atoms/Spinner'
import EmptyState from '@/components/atoms/EmptyState'
import Button from '@/components/atoms/Button'

const Sidebar: React.FC<SidebarProps> = ({
  onSelectNote,
  onNewNote,
  onNoteDeleted,
  selectedNoteId,
}) => {
  const {
    notes,
    notesLoading,
    noteToDelete,
    notePendingDelete,
    isDeleting,
    handleSearch,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useSidebar({ onSelectNote, onNoteDeleted, selectedNoteId })

  return (
    <>
      <aside className="border-border bg-surface flex h-full flex-col border-r">
        <div className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <StickyNote className="text-accent h-4 w-4" />
            <span className="text-text-primary text-sm font-semibold">Notes</span>
          </div>
          <Button size="sm" onClick={onNewNote} aria-label="New note">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        <div className="px-3 py-2">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
          {notesLoading ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <Spinner size="md" />
            </div>
          ) : notes.length === 0 ? (
            <EmptyState
              icon={<StickyNote className="h-6 w-6" />}
              title="No notes yet"
              description="Create your first note to get started"
              action={
                <Button size="sm" onClick={onNewNote}>
                  <Plus className="h-3.5 w-3.5" />
                  New note
                </Button>
              }
            />
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onSelectNote(note.id)}
                onDelete={() => handleDeleteRequest(note.id)}
              />
            ))
          )}
        </div>
      </aside>

      <ConfirmDialog
        isOpen={!!noteToDelete}
        title="Delete this note?"
        description={
          notePendingDelete
            ? `"${notePendingDelete.title || 'Untitled'}" will be permanently deleted.`
            : 'This action cannot be undone.'
        }
        confirmLabel="Delete note"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default Sidebar
