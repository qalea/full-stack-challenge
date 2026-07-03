import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

vi.mock('../db/client', () => ({
  prisma: {
    note: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}))

import { prisma } from '../db/client'

const fixedDate = new Date('2024-01-15T12:00:00.000Z')

const makeDbNote = (overrides = {}) => ({
  id: 'note-1',
  title: 'Test Note',
  content: 'Hello world',
  createdAt: fixedDate,
  updatedAt: fixedDate,
  noteTags: [],
  ...overrides,
})

const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /notes', () => {
  it('returns an array of notes', async () => {
    vi.mocked(prisma.note.findMany).mockResolvedValue([makeDbNote()] as never)

    const res = await request(app).get('/notes')

    expect(res.status).toBe(200)
    expect(res.body.notes).toHaveLength(1)
    expect(res.body.notes[0]).toMatchObject({ id: 'note-1', title: 'Test Note' })
  })

  it('passes q and tagId filters through to prisma', async () => {
    vi.mocked(prisma.note.findMany).mockResolvedValue([] as never)

    await request(app).get('/notes?q=hello&tagId=tag-1')

    const call = vi.mocked(prisma.note.findMany).mock.calls[0][0] as { where: { AND: unknown[] } }
    expect(JSON.stringify(call.where)).toContain('hello')
    expect(JSON.stringify(call.where)).toContain('tag-1')
  })
})

describe('GET /notes/:id', () => {
  it('returns the note when found', async () => {
    vi.mocked(prisma.note.findUnique).mockResolvedValue(makeDbNote() as never)

    const res = await request(app).get('/notes/note-1')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: 'note-1' })
  })

  it('returns 404 when the note does not exist', async () => {
    vi.mocked(prisma.note.findUnique).mockResolvedValue(null as never)

    const res = await request(app).get('/notes/missing')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Note not found')
  })
})

describe('POST /notes', () => {
  it('creates a note and returns 201', async () => {
    vi.mocked(prisma.note.create).mockResolvedValue(makeDbNote() as never)

    const res = await request(app)
      .post('/notes')
      .send({ title: 'New Note', content: 'Body', tagIds: [] })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ id: 'note-1' })
  })

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/notes').send({ content: 'No title here' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Validation error')
  })
})

describe('PUT /notes/:id', () => {
  it('updates and returns the note', async () => {
    vi.mocked(prisma.note.count).mockResolvedValue(1 as never)
    vi.mocked(prisma.note.update).mockResolvedValue(makeDbNote({ title: 'Updated' }) as never)

    const res = await request(app).put('/notes/note-1').send({ title: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Updated')
  })

  it('returns 404 when the note does not exist', async () => {
    vi.mocked(prisma.note.count).mockResolvedValue(0 as never)

    const res = await request(app).put('/notes/missing').send({ title: 'X' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /notes/:id', () => {
  it('deletes the note and returns 204', async () => {
    vi.mocked(prisma.note.count).mockResolvedValue(1 as never)
    vi.mocked(prisma.note.delete).mockResolvedValue(makeDbNote() as never)

    const res = await request(app).delete('/notes/note-1')

    expect(res.status).toBe(204)
  })

  it('returns 404 when the note does not exist', async () => {
    vi.mocked(prisma.note.count).mockResolvedValue(0 as never)

    const res = await request(app).delete('/notes/missing')

    expect(res.status).toBe(404)
  })
})
