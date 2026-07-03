import { describe, it, expect } from 'vitest'
import { getStringParam, formatNote, NotePayload } from './helpers'

describe('getStringParam', () => {
  it('returns the value when given a string', () => {
    expect(getStringParam('hello')).toBe('hello')
  })

  it('returns undefined for an array', () => {
    expect(getStringParam(['a', 'b'])).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(getStringParam(undefined)).toBeUndefined()
  })

  it('returns undefined for a number', () => {
    expect(getStringParam(42)).toBeUndefined()
  })

  it('returns an empty string as-is', () => {
    expect(getStringParam('')).toBe('')
  })
})

describe('formatNote', () => {
  const fixedDate = new Date('2024-01-15T12:00:00.000Z')

  const makeNote = (overrides: Partial<NotePayload> = {}): NotePayload =>
    ({
      id: 'note-1',
      title: 'Test Note',
      content: 'Hello world',
      createdAt: fixedDate,
      updatedAt: fixedDate,
      noteTags: [
        {
          noteId: 'note-1',
          tagId: 'tag-1',
          tag: { id: 'tag-1', name: 'work', color: '#6366f1', createdAt: fixedDate },
        },
      ],
      ...overrides,
    }) as NotePayload

  it('maps noteTags to a flat tags array', () => {
    const result = formatNote(makeNote())
    expect(result.tags).toHaveLength(1)
    expect(result.tags[0]).toMatchObject({ id: 'tag-1', name: 'work' })
  })

  it('converts dates to ISO strings', () => {
    const result = formatNote(makeNote())
    expect(result.createdAt).toBe('2024-01-15T12:00:00.000Z')
    expect(result.updatedAt).toBe('2024-01-15T12:00:00.000Z')
  })

  it('returns an empty tags array when noteTags is empty', () => {
    const result = formatNote(makeNote({ noteTags: [] }))
    expect(result.tags).toEqual([])
  })

  it('preserves id, title, and content', () => {
    const result = formatNote(makeNote())
    expect(result).toMatchObject({ id: 'note-1', title: 'Test Note', content: 'Hello world' })
  })
})
