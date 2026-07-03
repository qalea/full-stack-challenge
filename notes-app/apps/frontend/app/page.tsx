'use client'

import React, { useState, useCallback } from 'react'
import { StickyNote, ArrowLeft } from 'lucide-react'
import TwoColumnLayout from '@/components/templates/TwoColumnLayout'
import Sidebar from '@/components/organisms/Sidebar'
import NoteEditor from '@/components/organisms/NoteEditor'
import EmptyState from '@/components/atoms/EmptyState'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'
import { useCreateNoteQuery } from '@/hooks/useNotes'

const HomePage: React.FC = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>()
  const createNote = useCreateNoteQuery()

  const handleSelectNote = useCallback((id: string) => setSelectedNoteId(id), [])
  const handleNoteDeleted = useCallback(() => setSelectedNoteId(undefined), [])
  const handleBack = useCallback(() => setSelectedNoteId(undefined), [])

  const handleNewNote = useCallback(async () => {
    const note = await createNote.mutateAsync({
      title: 'Untitled note',
      content: '',
    })
    setSelectedNoteId(note.id)
  }, [createNote])

  const mainContent = selectedNoteId ? (
    <div className="flex h-full flex-col">
      {/* Mobile back button */}
      <div className="border-border bg-surface flex items-center gap-2 border-b px-4 py-2 md:hidden">
        <IconButton
          icon={<ArrowLeft className="h-4 w-4" />}
          label="Back to notes"
          onClick={handleBack}
        />
        <span className="text-text-muted text-sm font-medium">Notes</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <NoteEditor noteId={selectedNoteId} onDeleted={handleNoteDeleted} />
      </div>
    </div>
  ) : (
    <div className="bg-surface-muted flex h-full items-center justify-center">
      <EmptyState
        icon={<StickyNote className="h-7 w-7" />}
        title="Select a note"
        description="Choose a note from the sidebar, or create a new one."
        action={
          <Button isLoading={createNote.isPending} onClick={handleNewNote}>
            New note
          </Button>
        }
      />
    </div>
  )

  return (
    <main className="h-full">
      <TwoColumnLayout
        sidebar={
          <Sidebar
            onSelectNote={handleSelectNote}
            onNewNote={handleNewNote}
            onNoteDeleted={handleNoteDeleted}
            selectedNoteId={selectedNoteId}
          />
        }
        main={mainContent}
        showMain={!!selectedNoteId}
      />
    </main>
  )
}

export default HomePage
