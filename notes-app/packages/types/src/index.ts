export interface Tag {
  id: string
  name: string
  color: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteWithTags extends Note {
  tags: Tag[]
}

export interface CreateNoteInput {
  title: string
  content?: string
  tagIds?: string[]
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  tagIds?: string[]
}

export interface CreateTagInput {
  name: string
  color?: string
}

export interface NotesListResponse {
  notes: NoteWithTags[]
}

export interface TagsListResponse {
  tags: Tag[]
}

export interface ApiError {
  message: string
  status?: number
}
