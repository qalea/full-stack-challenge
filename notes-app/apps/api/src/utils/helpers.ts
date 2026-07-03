import { Prisma } from '@prisma/client'

export const noteInclude = {
  noteTags: { include: { tag: true } },
} satisfies Prisma.NoteInclude

export type NotePayload = Prisma.NoteGetPayload<{ include: typeof noteInclude }>

export const formatNote = (note: NotePayload) => ({
  id: note.id,
  title: note.title,
  content: note.content,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
  tags: note.noteTags.map((nt: NotePayload['noteTags'][number]) => nt.tag),
})

export const getStringParam = (v: unknown): string | undefined =>
  typeof v === 'string' ? v : undefined
