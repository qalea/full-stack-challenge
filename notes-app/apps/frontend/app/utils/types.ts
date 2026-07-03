import React from 'react'
import { NoteWithTags } from '@notes/types'

// ─── Atom props ───────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  variant?: 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

// ─── Molecule props ───────────────────────────────────────────────────────────

export interface NoteCardProps {
  note: NoteWithTags
  isSelected?: boolean
  onClick: () => void
  onDelete?: () => void
}

export interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// ─── Organism props ───────────────────────────────────────────────────────────

export interface SidebarProps {
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onNoteDeleted?: () => void
  selectedNoteId?: string
}

export interface NoteEditorProps {
  noteId: string
  onDeleted: () => void
}

// ─── Template props ───────────────────────────────────────────────────────────

export interface TwoColumnLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  showMain?: boolean
}

// ─── Hook props ───────────────────────────────────────────────────────────────

export interface UseSidebarProps {
  onSelectNote: (id: string) => void
  onNoteDeleted?: () => void
  selectedNoteId?: string
}

export interface UseNoteCardProps {
  note: NoteWithTags
}

export interface UseSearchBarProps {
  onSearch: (value: string) => void
  initialValue?: string
}
